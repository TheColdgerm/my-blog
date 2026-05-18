/**
 * rehype-obsidian-wikilink.mjs
 *
 * 功能：将 Obsidian 的 [[双链]] 转换为 HTML 链接/图片元素
 *
 * 定位：rehype 插件，在 MDAST → HAST 转换之后运行。
 * 比 remark 插件更可靠，因为操作的是最终的 HTML AST。
 *
 * 支持的格式：
 *   [[页面名称]]           → <a href="/posts/页面名称/">页面名称</a>
 *   [[页面名称|显示文字]]  → <a href="/posts/页面名称/">显示文字</a>
 *   [[页面名称#标题锚点]]  → <a href="/posts/页面名称/#标题锚点">页面名称</a>
 *   ![[图片.png]]          → <img src="/images/from-obsidian/图片.png" alt="图片">
 *   ![[图片.png|200]]      → <img src="/images/from-obsidian/图片.png" alt="图片 (200)">
 *   ![[页面名称]]          → <a href="/posts/页面名称/">页面名称</a>
 *   [[附件.pdf]]           → <a href="/attachments/附件.pdf">附件.pdf</a>
 */

import { h } from "hastscript";
import { visit } from "unist-util-visit";

/**
 * Obsidian Wikilink 正则
 *
 * 分组说明：
 *   $1: 是否嵌入（感叹号）
 *   $2: 链接目标（页面名/文件名，可能含 # 标题）
 *   $3: 可选的显示文字（| 后面的内容）
 */
const WIKILINK_REGEX = /(!?)\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;

// 常见图片扩展名
const IMAGE_EXTENSIONS = new Set([
	".png", ".jpg", ".jpeg", ".gif", ".svg",
	".webp", ".bmp", ".tiff", ".tif", ".ico",
]);

// 常见附件扩展名
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
 * 与 Astro 的 slug 生成规则保持一致：ASCII 小写、移除点号
 */
function toSlug(text) {
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

function encodeFragment(text) {
	return encodeURIComponent(text.replace(/\s+/g, "-"));
}

/**
 * 将一段包含 wikilinks 的文本拆分为 HAST 节点数组
 * 纯文本 → text 节点，wikilinks → element (a/img) 节点
 */
function splitTextWithWikilinks(text) {
	const nodes = [];
	let lastIndex = 0;
	let match;

	WIKILINK_REGEX.lastIndex = 0;

	while ((match = WIKILINK_REGEX.exec(text)) !== null) {
		// 添加 wikilink 之前的普通文本
		if (match.index > lastIndex) {
			nodes.push({ type: "text", value: text.slice(lastIndex, match.index) });
		}

		// 生成 wikilink 对应的 HTML 节点
		const [full, isEmbed, target, alias] = match;

		if (isEmbed === "!" && isImage(target)) {
			// ![[图片.png]] → <img>
			const alt = alias ? `${target} (${alias})` : target;
			nodes.push(
				h("img", {
					src: `/images/from-obsidian/${encodeURIComponent(target)}`,
					alt: alt,
				}),
			);
		} else if (isEmbed === "!") {
			// ![[笔记]] → <a>
			let pageName = target;
			let heading = null;
			const hashIndex = target.indexOf("#");
			if (hashIndex !== -1) {
				pageName = target.substring(0, hashIndex);
				heading = target.substring(hashIndex + 1);
			}
			const displayText = alias || (heading ? `${pageName} > ${heading}` : pageName);
			const slug = toSlug(pageName);
			const headingFragment = heading ? `#${encodeFragment(heading)}` : "";
			const linkProps = { href: `/posts/${slug}/${headingFragment}` };
			// 有标题锚点时添加 data-no-swup，让浏览器原生处理锚点跳转
			if (heading) linkProps["data-no-swup"] = true;
			nodes.push(
				h("a", linkProps, [
					{ type: "text", value: displayText },
				]),
			);
		} else {
			// [[页面]] 或 [[附件.pdf]]
			let pageName = target;
			let heading = null;
			const hashIndex = target.indexOf("#");
			if (hashIndex !== -1) {
				pageName = target.substring(0, hashIndex);
				heading = target.substring(hashIndex + 1);
			}

			if (isAttachment(pageName)) {
				// [[附件.pdf]] → 附件链接
				const text = alias || pageName;
				nodes.push(
					h("a", { href: `/attachments/${encodeURIComponent(target)}` }, [
						{ type: "text", value: text },
					]),
				);
			} else {
				// [[页面名称]] → 笔记链接
				const displayText = alias || (heading ? `${pageName} > ${heading}` : pageName);
				const slug = toSlug(pageName);
				const headingFragment = heading ? `#${encodeFragment(heading)}` : "";
				const linkProps = { href: `/posts/${slug}/${headingFragment}` };
				// 有标题锚点时添加 data-no-swup，让浏览器原生处理锚点跳转
				if (heading) linkProps["data-no-swup"] = true;
				nodes.push(
					h("a", linkProps, [
						{ type: "text", value: displayText },
					]),
				);
			}
		}

		lastIndex = match.index + full.length;
	}

	// 添加剩余普通文本
	if (lastIndex < text.length) {
		nodes.push({ type: "text", value: text.slice(lastIndex) });
	}

	return nodes;
}

export function rehypeObsidianWikilink() {
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
