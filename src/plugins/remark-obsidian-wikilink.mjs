/**
 * remark-obsidian-wikilink.mjs
 *
 * 功能：将 Obsidian 的 [[双链]] 转换为 MDAST 链接/图片节点
 *
 * 关键设计：
 * - 直接生成 MDAST（markdown AST）节点，而非生成 markdown 文本
 * - remark 不会重新解析文本节点中的 markdown 语法，所以必须生成 AST 节点
 *
 * 支持的 Obsidian 链接格式：
 *
 * 1. 页面链接（内部链接）
 *    [[页面名称]]           → <a href="/posts/页面名称/">页面名称</a>
 *    [[页面名称|显示文字]]  → <a href="/posts/页面名称/">显示文字</a>
 *    [[页面名称#标题锚点]]  → <a href="/posts/页面名称/#标题锚点">页面名称</a>
 *
 * 2. 图片嵌入
 *    ![[图片.png]]                  → <img src="/images/from-obsidian/图片.png" alt="图片">
 *    ![[图片.png|200]]              → <img src="/images/from-obsidian/图片.png" alt="图片 (200)">
 *
 * 3. 嵌入链接（非图片的嵌入，如 ![[笔记#章节]]）
 *    ![[页面名称]]           → <a href="/posts/页面名称/">页面名称</a>
 *    ![[页面名称#标题锚点]]  → <a href="/posts/页面名称/#标题锚点">页面名称</a>
 *
 * 4. 附件链接
 *    [[附件.pdf]]           → <a href="/attachments/附件.pdf">附件.pdf</a>
 *
 * 注意：
 * - 该插件作为"安全网"运行，确保即使迁移脚本没处理到的双链也能正常显示
 * - 使用 collect-then-apply 策略安全替换文本节点
 * - slug 与 Astro 的 slug 生成规则保持一致：ASCII 小写、移除点号
 */

import { visit } from "unist-util-visit";

/**
 * Obsidian Wikilink 正则
 *
 * 分组说明：
 *   $1: 是否嵌入（感叹号存在时为 "!"，否则为 undefined）
 *   $2: 链接目标（页面名、文件名、可能带 # 标题）
 *   $3: 可选的显示文字或参数（"|" 后面的内容）
 */
const WIKILINK_REGEX = /(!?)\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;

// 常见图片扩展名列表
const IMAGE_EXTENSIONS = new Set([
	".png", ".jpg", ".jpeg", ".gif", ".svg",
	".webp", ".bmp", ".tiff", ".tif", ".ico",
]);

// 常见文档/附件扩展名列表
const ATTACHMENT_EXTENSIONS = new Set([
	".pdf", ".doc", ".docx", ".xls", ".xlsx",
	".ppt", ".pptx", ".zip", ".rar", ".7z",
	".tar", ".gz", ".mp3", ".mp4", ".mov",
	".avi", ".mkv", ".txt", ".csv", ".json",
	".xml", ".yaml", ".yml",
]);

function isImage(path) {
	const dotIndex = path.lastIndexOf(".");
	if (dotIndex === -1) return false;
	return IMAGE_EXTENSIONS.has(path.substring(dotIndex).toLowerCase());
}

function isAttachment(path) {
	const dotIndex = path.lastIndexOf(".");
	if (dotIndex === -1) return false;
	return ATTACHMENT_EXTENSIONS.has(path.substring(dotIndex).toLowerCase());
}

/**
 * 将页面名称转换为 URL slug
 * 与 Astro 的 slug 生成规则保持一致：
 * - ASCII 字母转小写
 * - 移除点号（.）
 * - 中文等非 ASCII 保持不变
 */
function toSlug(text) {
	// 移除文件扩展名
	const dotIndex = text.lastIndexOf(".");
	if (dotIndex !== -1) {
		const ext = text.substring(dotIndex).toLowerCase();
		if (IMAGE_EXTENSIONS.has(ext) || ATTACHMENT_EXTENSIONS.has(ext)) {
			text = text.substring(0, dotIndex);
		}
	}
	return text
		.toLowerCase()
		.replace(/\./g, "")
		.replace(/[^\w\u4e00-\u9fff\-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/**
 * 编码 URL 片段（标题锚点）
 */
function encodeFragment(text) {
	return encodeURIComponent(text.replace(/\s+/g, "-"));
}

/**
 * 解析 wikilink 匹配结果，生成对应的 MDAST 节点
 */
function createNodesFromMatch(match) {
	const [full, isEmbed, target, alias] = match;
	const isImageEmbed = isEmbed === "!" && isImage(target);

	if (isImageEmbed) {
		// ![[图片.png]] → MDAST image 节点
		const alt = alias ? `${target} (${alias})` : target;
		return {
			type: "image",
			url: `/images/from-obsidian/${encodeURIComponent(target)}`,
			alt: alt,
			title: null,
		};
	}

	// 处理 # 标题锚点
	let pageName = target;
	let heading = null;
	const hashIndex = target.indexOf("#");
	if (hashIndex !== -1) {
		pageName = target.substring(0, hashIndex);
		heading = target.substring(hashIndex + 1);
	}

	// 附件链接
	if (isAttachment(pageName)) {
		const text = alias || pageName;
		return {
			type: "link",
			url: `/attachments/${encodeURIComponent(target)}`,
			title: null,
			children: [{ type: "text", value: text }],
		};
	}

	// 普通笔记链接（包括 ![[embed]] 也转为普通链接）
	const displayText = alias || (heading ? `${pageName} > ${heading}` : pageName);
	const slug = toSlug(pageName);
	const headingFragment = heading ? `#${encodeFragment(heading)}` : "";
	const linkNode = {
		type: "link",
		url: `/posts/${slug}/${headingFragment}`,
		title: null,
		children: [{ type: "text", value: displayText }],
	};
	// 有标题锚点时添加 data-no-swup，让浏览器原生处理锚点跳转
	if (heading) {
		linkNode.data = {
			hProperties: { "data-no-swup": true },
		};
	}
	return linkNode;
}

/**
 * 将文本节点中的 wikilinks 拆分为 MDAST 节点数组
 * 纯文本部分保留为文本节点，wikilinks 转为链接/图片节点
 */
function splitTextWithWikilinks(text) {
	const nodes = [];
	let lastIndex = 0;
	let match;

	WIKILINK_REGEX.lastIndex = 0;

	while ((match = WIKILINK_REGEX.exec(text)) !== null) {
		// 添加 wikilink 之前的普通文本
		if (match.index > lastIndex) {
			nodes.push({
				type: "text",
				value: text.slice(lastIndex, match.index),
			});
		}

		// 添加 wikilink 生成的节点
		const wikilinkNode = createNodesFromMatch(match);
		nodes.push(wikilinkNode);

		lastIndex = match.index + match[0].length;
	}

	// 添加剩余文本
	if (lastIndex < text.length) {
		nodes.push({
			type: "text",
			value: text.slice(lastIndex),
		});
	}

	return nodes;
}

export function remarkObsidianWikilink() {
	return (tree) => {
		const replacements = [];

		let foundCount = 0;
		visit(tree, "text", (node, index, parent) => {
			if (!parent || index === undefined || !node.value) return;

			WIKILINK_REGEX.lastIndex = 0;
			if (!WIKILINK_REGEX.test(node.value)) return;

			foundCount++;
			const newNodes = splitTextWithWikilinks(node.value);
			replacements.push({ parent, index, newNodes });
		});

		// 从后往前替换，保持索引正确
		replacements.reverse();
		for (const { parent, index, newNodes } of replacements) {
			parent.children.splice(index, 1, ...newNodes);
		}

	};
}
