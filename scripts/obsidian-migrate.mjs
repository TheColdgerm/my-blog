#!/usr/bin/env node

/**
 * obsidian-migrate.mjs
 *
 * Obsidian 笔记迁移脚本
 *
 * 功能：
 *   1. 扫描 Obsidian Vault 中的所有 .md 文件
 *   2. 自动补全缺失的 frontmatter（标题、日期等）
 *   3. 处理 Obsidian 特有语法（%% 注释、[[双链]]、![[图片]]）
 *   4. 复制附件到公共目录并重写路径
 *   5. 输出到 src/content/posts/
 *
 * 用法：
 *   pnpm obsidian-migrate --source <Obsidian-Vault路径> [选项]
 *
 * 选项：
 *   --source, -s   Obsidian Vault 路径（必填，指向 .md 文件所在的主文件夹）
 *   --dry-run, -d  仅预览会迁移哪些文件，不实际执行
 *   --help, -h     显示帮助
 *
 * 示例：
 *   pnpm obsidian-migrate -s "D:/MyVault"
 *   pnpm obsidian-migrate -s "D:/MyVault" -d
 *
 * 工作原理：
 *   - 读取 source 目录下的所有 .md 文件（递归）
 *   - 若文件没有 frontmatter，自动生成：
 *       title:    取第一个 # 标题；若无则用文件名
 *       published: 取文件修改时间
 *       draft:     true（防止未完成的笔记被发布）
 *   - 处理 %% 注释（直接移除）
 *   - 处理 [[双链]]（转为 Markdown 链接）
 *   - 处理 ![[图片]]（复制图片到 public/images/from-obsidian/）
 *   - 处理标准 Markdown 图片链接（复制图片 + 重写路径）
 *   - 输出到 src/content/posts/
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import { fileURLToPath } from "node:url";

// ============================================================
// 路径常量
// ============================================================
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.resolve(PROJECT_ROOT, "src/content/posts");
const PUBLIC_IMAGE_DIR = path.resolve(
	PROJECT_ROOT,
	"public/images/from-obsidian",
);
const PUBLIC_ATTACHMENT_DIR = path.resolve(
	PROJECT_ROOT,
	"public/attachments",
);

// 日志颜色
const COLORS = {
	reset: "\x1b[0m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	red: "\x1b[31m",
	cyan: "\x1b[36m",
	gray: "\x1b[90m",
};

function logColor(color, ...args) {
	console.log(color, ...args, COLORS.reset);
}

// ============================================================
// 正则表达式
// ============================================================

/** Obsidian %% 注释 */
const COMMENT_REGEX = /%%[\s\S]*?%%/g;

/** Obsidian Wikilink：[[目标]]、[[目标|显示文字]]、![[图片]]、![[图片|尺寸]] */
const WIKILINK_REGEX = /(!?)\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;

/** 标准 Markdown 图片：![alt](路径) */
const MD_IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;

/** Markdown 链接：[文字](路径) */
const MD_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Frontmatter 分隔符 */
const FRONTMATTER_REGEX = /^---\s*\n[\s\S]*?\n---\s*\n/;

/** Markdown 标题 */
const HEADING_REGEX = /^#\s+(.+)$/m;

/** 图片扩展名 */
const IMAGE_EXTS = new Set([
	".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp",
	".bmp", ".tiff", ".tif", ".ico",
]);

// ============================================================
// 辅助函数
// ============================================================

/**
 * 判断一个路径是否指向图片
 */
function isImagePath(filePath) {
	const ext = path.extname(filePath).toLowerCase();
	return IMAGE_EXTS.has(ext);
}

/**
 * 将文件名转为标题（去除扩展名、下划线/连字符替换为空格）
 */
function filenameToTitle(filename) {
	return path.basename(filename, path.extname(filename))
		.replace(/[-_]+/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * 将标题转为 slug（用于 URL）
 */
function titleToSlug(title) {
	return title
		.toLowerCase()
		.replace(/[^\w\u4e00-\u9fff]+/g, "-")
		.replace(/^-+|-+$/g, "")
		|| "untitled";
}

/**
 * 递归获取目录下所有 .md 文件
 */
function findMarkdownFiles(dir) {
	const results = [];
	if (!fs.statSync(dir).isDirectory()) {
		// 如果 source 指向单个文件，也处理
		if (dir.endsWith(".md")) {
			return [dir];
		}
		return results;
	}

	for (const entry of fs.readdirSync(dir)) {
		const fullPath = path.join(dir, entry);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			// 跳过 .obsidian 等隐藏目录和 node_modules
			if (!entry.startsWith(".") && entry !== "node_modules") {
				results.push(...findMarkdownFiles(fullPath));
			}
		} else if (entry.endsWith(".md")) {
			results.push(fullPath);
		}
	}
	return results;
}

/**
 * 检查文件是否已有 frontmatter
 */
function hasFrontmatter(content) {
	return FRONTMATTER_REGEX.test(content);
}

/**
 * 从内容中提取第一个 H1 标题
 */
function extractTitleFromContent(content) {
	const match = content.match(HEADING_REGEX);
	return match ? match[1].trim() : null;
}

/**
 * 为没有 frontmatter 的文件生成 frontmatter
 */
function generateFrontmatter(filename, content) {
	// 1. 确定标题
	let title = extractTitleFromContent(content);
	if (!title) {
		title = filenameToTitle(filename);
	}

	// 2. slug 化
	const slug = titleToSlug(title);

	// 3. 获取文件修改时间作为 published 日期
	const stat = fs.statSync(filename);
	const publishedDate = new Date(stat.mtime);
	const publishedStr = publishedDate.toISOString().split("T")[0]; // YYYY-MM-DD

	// 4. 组装 frontmatter
	return `---
title: "${title}"
published: ${publishedStr}
draft: true
description: ""
tags: []
category: ""
---

`;
}

/**
 * 从内容中移除 Obsidian %% 注释
 */
function removeObsidianComments(content) {
	return content.replace(COMMENT_REGEX, "");
}

/**
 * 解析 Obsidian [[wikilink]]，返回所有引用的本地文件路径
 *
 * 返回：{ originalRef, resolvedPath }[]
 */
function findWikilinkRefs(content, mdFilePath, vaultDir) {
	const refs = [];
	let match;

	WIKILINK_REGEX.lastIndex = 0;
	while ((match = WIKILINK_REGEX.exec(content)) !== null) {
		const isEmbed = match[1] === "!";
		const target = match[2].trim();

		if (isEmbed || isImagePath(target)) {
			// 尝试查找该文件：
			// 1. 相对于当前 .md 文件
			// 2. 相对于 vault 目录
			// 3. 在当前目录的 "附件" 子目录
			// 4. 在 vault 的 "附件" 子目录
			const searchPaths = [
				path.resolve(path.dirname(mdFilePath), target),
				path.resolve(vaultDir, target),
				path.resolve(path.dirname(mdFilePath), "附件", target),
				path.resolve(vaultDir, "附件", target),
				path.resolve(path.dirname(mdFilePath), "assets", target),
				path.resolve(vaultDir, "assets", target),
			];

			for (const sp of searchPaths) {
				if (fs.existsSync(sp)) {
					refs.push({
						originalRef: match[0],
						target,
						resolvedPath: sp,
						isEmbed,
					});
					break;
				}
			}
		}
	}

	return refs;
}

/**
 * 解析标准 Markdown 图片/链接中的本地文件引用
 */
function findLocalFileRefs(content, mdFilePath, vaultDir) {
	const refs = [];

	// 检查 Markdown 图片
	let match;
	MD_IMAGE_REGEX.lastIndex = 0;
	while ((match = MD_IMAGE_REGEX.exec(content)) !== null) {
		const imgPath = match[2].trim();
		if (isImagePath(imgPath) && !imgPath.startsWith("http://") && !imgPath.startsWith("https://") && !imgPath.startsWith("data:")) {
			const searchPaths = [
				path.resolve(path.dirname(mdFilePath), imgPath),
				path.resolve(vaultDir, imgPath),
				path.resolve(path.dirname(mdFilePath), "附件", imgPath),
				path.resolve(vaultDir, "附件", imgPath),
			];

			for (const sp of searchPaths) {
				if (fs.existsSync(sp)) {
					refs.push({
						originalRef: match[0],
						target: imgPath,
						resolvedPath: sp,
						isEmbed: true,
					});
					break;
				}
			}
		}
	}

	return refs;
}

/**
 * 复制文件到目标目录，返回公共 URL 路径
 */
function copyFileToPublic(sourcePath, targetDir, publicBaseUrl) {
	if (!fs.existsSync(sourcePath)) return null;

	const fileName = path.basename(sourcePath);
	const targetPath = path.resolve(targetDir, fileName);

	// 避免同名覆盖：如果目标已存在且内容不同，添加数字后缀
	let finalName = fileName;
	let finalTarget = targetPath;
	let counter = 1;
	while (fs.existsSync(finalTarget)) {
		const existingContent = fs.readFileSync(finalTarget);
		const newContent = fs.readFileSync(sourcePath);
		if (existingContent.equals(newContent)) {
			// 内容相同，直接返回
			return `${publicBaseUrl}/${finalName}`;
		}
		const ext = path.extname(fileName);
		const base = path.basename(fileName, ext);
		finalName = `${base}_${counter}${ext}`;
		finalTarget = path.resolve(targetDir, finalName);
		counter++;
	}

	// 确保目录存在
	fs.mkdirSync(targetDir, { recursive: true });
	fs.copyFileSync(sourcePath, finalTarget);
	return `${publicBaseUrl}/${finalName}`;
}

/**
 * 处理单个文件的 Obsidian 语法，重写引用路径
 */
function processContent(
	content,
	mdFilePath,
	vaultDir,
	stats,
) {
	let processed = content;

	// 1. 移除 %% 注释
	processed = removeObsidianComments(processed);

	// 2. 查找所有引用的本地文件
	const refs = [
		...findWikilinkRefs(processed, mdFilePath, vaultDir),
		...findLocalFileRefs(processed, mdFilePath, vaultDir),
	];

	// 3. 复制文件并重写引用路径
	for (const ref of refs) {
		const originalRef = ref.originalRef;
		const resolvedPath = ref.resolvedPath;

		if (!fs.existsSync(resolvedPath)) {
			logColor(COLORS.yellow, `  ⚠ 文件未找到: ${ref.target}`);
			continue;
		}

		let publicUrl;
		if (isImagePath(resolvedPath)) {
			publicUrl = copyFileToPublic(
				resolvedPath,
				PUBLIC_IMAGE_DIR,
				"/images/from-obsidian",
			);
		} else {
			publicUrl = copyFileToPublic(
				resolvedPath,
				PUBLIC_ATTACHMENT_DIR,
				"/attachments",
			);
		}

		if (!publicUrl) continue;

		// 根据引用类型重写
		if (ref.isEmbed && isImagePath(ref.target)) {
			// ![[图片.png]] → ![alt](/images/from-obsidian/图片.png)
			const alt = path.basename(ref.target, path.extname(ref.target));
			const newRef = `![${alt}](${publicUrl})`;
			processed = processed.replace(originalRef, newRef);
			logColor(COLORS.gray, `    📷 ${ref.target} → ${publicUrl}`);
		} else if (ref.isEmbed) {
			// ![[附件.pdf]] → [附件](/attachments/附件.pdf)
			const name = path.basename(ref.target);
			const newRef = `[${name}](${publicUrl})`;
			processed = processed.replace(originalRef, newRef);
			logColor(COLORS.gray, `    📎 ${ref.target} → ${publicUrl}`);
		}

		// 处理标准 Markdown 图片路径
		// 此时 processed 中可能还有旧的图片路径
		const oldImagePattern = new RegExp(
			`!\\[([^\\]]*)\\]\\(${escapeRegex(ref.target)}\\)`,
			"g",
		);
		processed = processed.replace(
			oldImagePattern,
			`![$1](${publicUrl})`,
		);
	}

	return {
		content: processed,
		imageCount: refs.filter((r) => isImagePath(r.resolvedPath)).length,
		attachmentCount: refs.filter((r) => !isImagePath(r.resolvedPath)).length,
	};
}

/**
 * 转义正则特殊字符
 */
function escapeRegex(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ============================================================
// 主函数
// ============================================================

async function main() {
	// --- 解析命令行参数 ---
	const args = process.argv.slice(2);
	const helpFlags = ["--help", "-h"];
	const dryRunFlags = ["--dry-run", "-d"];

	if (args.length === 0 || args.some((a) => helpFlags.includes(a))) {
		console.log(`
${COLORS.cyan}Obsidian → Astro (Mizuki) 笔记迁移工具${COLORS.reset}

${COLORS.yellow}用法:${COLORS.reset}
  node scripts/obsidian-migrate.mjs --source <Obsidian-Vault路径> [选项]

${COLORS.yellow}选项:${COLORS.reset}
  --source, -s   Obsidian Vault 路径（必填）
  --dry-run, -d  仅预览，不实际执行
  --help, -h     显示此帮助

${COLORS.yellow}示例:${COLORS.reset}
  node scripts/obsidian-migrate.mjs -s "D:/ObsidianVault"
  node scripts/obsidian-migrate.mjs -s "D:/ObsidianVault" -d
		`);
		process.exit(0);
	}

	const sourceIndex = args.findIndex(
		(a) => a === "--source" || a === "-s",
	);
	if (sourceIndex === -1 || sourceIndex >= args.length - 1) {
		logColor(COLORS.red, "❌ 错误：必须指定 --source 参数");
		process.exit(1);
	}

	const sourceDir = path.resolve(args[sourceIndex + 1]);
	const isDryRun = args.some((a) => dryRunFlags.includes(a));

	if (!fs.existsSync(sourceDir)) {
		logColor(COLORS.red, `❌ 错误：路径不存在: ${sourceDir}`);
		process.exit(1);
	}

	// --- 显示配置 ---
	console.log(`\n${COLORS.cyan}═════════════════════════════════════════${COLORS.reset}`);
	console.log(`${COLORS.cyan}  Obsidian → Astro (Mizuki) 迁移工具${COLORS.reset}`);
	console.log(`${COLORS.cyan}═════════════════════════════════════════${COLORS.reset}\n`);

	logColor(COLORS.blue, `📂 源路径:     ${sourceDir}`);
	logColor(COLORS.blue, `📂 目标路径:   ${CONTENT_DIR}`);
	logColor(COLORS.blue, `📂 图片输出:   ${PUBLIC_IMAGE_DIR}`);
	if (isDryRun) {
		logColor(COLORS.yellow, `\n🔍 干运行模式 - 仅预览，不写入任何文件\n`);
	}

	// --- 查找所有 .md 文件 ---
	logColor(COLORS.cyan, "\n🔍 正在扫描 .md 文件...");
	const mdFiles = findMarkdownFiles(sourceDir);

	if (mdFiles.length === 0) {
		logColor(COLORS.yellow, "⚠ 未找到任何 .md 文件");
		process.exit(0);
	}

	logColor(COLORS.green, `   找到 ${mdFiles.length} 个 .md 文件\n`);

	// --- 处理每个文件 ---
	let processedCount = 0;
	let frontmatterAddedCount = 0;
	let errorCount = 0;
	let totalImagesCopied = 0;
	let totalAttachments = 0;

	for (const mdFile of mdFiles) {
		const relativePath = path.relative(sourceDir, mdFile);
		const fileName = path.basename(mdFile);

		try {
			let content = fs.readFileSync(mdFile, "utf-8");

			// 检查 frontmatter
			const hasFM = hasFrontmatter(content);
			let needsFrontmatter = false;

			if (!hasFM) {
				needsFrontmatter = true;
				frontmatterAddedCount++;
				const fm = generateFrontmatter(mdFile, content);
				content = fm + content;
				logColor(COLORS.yellow, `  📄 +frontmatter: ${relativePath}`);
			} else {
				logColor(COLORS.gray, `  📄 ${relativePath}`);
			}

			// 处理内容（评论、双链、图片路径）
			const result = processContent(
				content,
				mdFile,
				sourceDir,
				{},
			);

			totalImagesCopied += result.imageCount;
			totalAttachments += result.attachmentCount;

			// 写入文件（非 dry-run 模式）
			if (!isDryRun) {
				const outputPath = path.resolve(CONTENT_DIR, fileName);

				// 处理重名文件
				let finalOutputPath = outputPath;
				let counter = 1;
				while (fs.existsSync(finalOutputPath)) {
					const ext = path.extname(fileName);
					const base = path.basename(fileName, ext);
					finalOutputPath = path.resolve(
						CONTENT_DIR,
						`${base}_${counter}${ext}`,
					);
					counter++;
				}

				fs.mkdirSync(path.dirname(finalOutputPath), { recursive: true });
				fs.writeFileSync(finalOutputPath, result.content, "utf-8");
			}

			processedCount++;

			// 打印处理摘要
			if (result.imageCount > 0 || result.attachmentCount > 0) {
				const parts = [];
				if (result.imageCount > 0) parts.push(`${result.imageCount} 张图片`);
				if (result.attachmentCount > 0) parts.push(`${result.attachmentCount} 个附件`);
				logColor(COLORS.gray, `     引用 ${parts.join("、")}`);
			}
		} catch (err) {
			errorCount++;
			logColor(COLORS.red, `  ❌ 处理失败: ${relativePath}`);
			console.error(`     ${err.message}`);
		}
	}

	// --- 输出摘要 ---
	console.log(`\n${COLORS.cyan}═════════════════════════════════════════${COLORS.reset}`);
	console.log(`${COLORS.cyan}  迁移完成${COLORS.reset}`);
	console.log(`${COLORS.cyan}═════════════════════════════════════════${COLORS.reset}\n`);

	logColor(COLORS.green, `  ✅ 已处理:   ${processedCount} 个文件`);
	logColor(COLORS.yellow, `  📝 补充 frontmatter: ${frontmatterAddedCount} 个文件`);

	if (!isDryRun) {
		logColor(COLORS.blue, `  📷 图片:     ${totalImagesCopied} 张`);
		logColor(COLORS.blue, `  📎 附件:     ${totalAttachments} 个`);
	}

	if (errorCount > 0) {
		logColor(COLORS.red, `  ❌ 失败:     ${errorCount} 个文件`);
	}

	if (isDryRun) {
		logColor(COLORS.yellow, "\n⚠ 这是干运行，没有写入任何文件。移除 -d 参数以实际执行。\n");
	} else {
		console.log(`\n${COLORS.gray}提示:${COLORS.reset}`);
		console.log(`  • ${COLORS.yellow}自动补全的 frontmatter 中 draft: true${COLORS.reset}`);
		console.log(`    请根据需要修改每个文件的 frontmatter`);
		console.log(`  • 图片已复制到 ${COLORS.cyan}public/images/from-obsidian/${COLORS.reset}`);
		console.log(`  • 附件已复制到 ${COLORS.cyan}public/attachments/${COLORS.reset}`);
		console.log(`  • 如有其他 Obsidian 语法兼容问题，remark 插件会在构建时处理\n`);
	}
}

main().catch((err) => {
	console.error("❌ 迁移脚本出错:", err);
	process.exit(1);
});
