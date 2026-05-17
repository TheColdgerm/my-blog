#!/usr/bin/env node

/**
 * fix-frontmatter.mjs
 *
 * 功能：修复 src/content/posts/ 中 .md 文件的 frontmatter
 *       确保每个文件都有 Astro 内容模式所需的 title 和 published 字段。
 *
 * 解决两类问题：
 *   1. 文件完全没有 frontmatter
 *   2. 文件有 Obsidian 风格的 frontmatter（如 "类型"、"撰写时间"）
 *      但缺少 Astro 所需的 title、published 字段
 *
 * 用法：
 *   node scripts/fix-frontmatter.mjs
 *
 * 自动补全规则：
 *   - title: 取第一个 # 标题；若无则用文件名
 *   - published: 取文件修改日期
 *   - draft: true（安全起见默认为草稿）
 *   - 尝试从 Obsidian frontmatter 中提取已有信息
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, "../src/content/posts");

const COLORS = {
	reset: "\x1b[0m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	red: "\x1b[31m",
	gray: "\x1b[90m",
	cyan: "\x1b[36m",
};

// 匹配 --- ... --- 包裹的 frontmatter 块（含 trailing newline）
const FRONTMATTER_REGEX = /^---\s*\n[\s\S]*?\n---\s*\n/;

// 匹配第一个 # 标题
const HEADING_REGEX = /^#\s+(.+)$/m;

/**
 * 判断 frontmatter 是否包含 Astro 所需的 title 和 published
 */
function hasValidAstroFrontmatter(content) {
	const match = content.match(FRONTMATTER_REGEX);
	if (!match) return false;
	const fmBlock = match[0];
	// YAML 中 title: 或 "title": 都算
	return /^title\s*:/m.test(fmBlock) && /^published\s*:/m.test(fmBlock);
}

/**
 * 移除现有的 frontmatter 块（如果有），返回剩余内容
 */
function stripFrontmatter(content) {
	return content.replace(FRONTMATTER_REGEX, "");
}

/**
 * 尝试从 Obsidian frontmatter 中提取已有字段
 */
function extractObsidianTitle(content) {
	const match = content.match(FRONTMATTER_REGEX);
	if (!match) return null;
	const fmBlock = match[0];

	// Obsidian 中可能的标题字段名
	const titleKeys = ["标题", "title", "Title", "题目"];
	for (const key of titleKeys) {
		const regex = new RegExp(`^${key}\\s*[:：]\\s*(.+)$`, "m");
		const m = fmBlock.match(regex);
		if (m) {
			return m[1].trim().replace(/^["']|["']$/g, "");
		}
	}
	return null;
}

function filenameToTitle(filename) {
	return path
		.basename(filename, path.extname(filename))
		// 去掉数字编号如 "1.2"、"6.1" 等前缀
		.replace(/^[\d.]+/, "")
		.replace(/[-_]+/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase())
		.trim() || path.basename(filename, path.extname(filename));
}

function extractTitle(content) {
	// 先看 Obsidian 的 frontmatter 有没有标题
	const obsidianTitle = extractObsidianTitle(content);
	if (obsidianTitle) return obsidianTitle;

	// 再看第一个 H1
	const match = content.match(HEADING_REGEX);
	if (match) return match[1].trim();

	return null;
}

function getPublishedDate(filePath) {
	const stat = fs.statSync(filePath);
	return stat.mtime.toISOString().split("T")[0];
}

function generateFrontmatter(title, publishedDate) {
	return `---
title: "${title}"
published: ${publishedDate}
draft: true
description: ""
tags: []
category: ""
---

`;
}

function findMarkdownFiles(dir) {
	const results = [];
	for (const entry of fs.readdirSync(dir)) {
		const fullPath = path.join(dir, entry);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			if (!entry.startsWith(".") && entry !== "node_modules") {
				results.push(...findMarkdownFiles(fullPath));
			}
		} else if (entry.endsWith(".md")) {
			results.push(fullPath);
		}
	}
	return results;
}

// ===== 主逻辑 =====
console.log(`\n${COLORS.cyan}════════════════════════════════════${COLORS.reset}`);
console.log(`${COLORS.cyan}  Frontmatter 修复工具 v2${COLORS.reset}`);
console.log(`${COLORS.cyan}════════════════════════════════════${COLORS.reset}\n`);

console.log(`${COLORS.blue}📂 扫描目录: ${POSTS_DIR}${COLORS.reset}\n`);

const mdFiles = findMarkdownFiles(POSTS_DIR);
let fixedCount = 0;
let alreadyValidCount = 0;
let errorCount = 0;

for (const filePath of mdFiles) {
	const relativePath = path.relative(POSTS_DIR, filePath);
	try {
		const content = fs.readFileSync(filePath, "utf-8");

		// 检查是否已有合法的 Astro frontmatter
		if (hasValidAstroFrontmatter(content)) {
			alreadyValidCount++;
			continue;
		}

		// ===== 需要修复 =====
		// 1. 提取标题
		let title = extractTitle(content);
		if (!title) {
			title = filenameToTitle(filePath);
		}

		// 2. 移除旧的 frontmatter（无论是 Obsidian 格式还是残缺的）
		const cleanContent = stripFrontmatter(content);

		// 3. 生成新 frontmatter
		const published = getPublishedDate(filePath);
		const fm = generateFrontmatter(title, published);

		// 4. 写入
		const newContent = fm + cleanContent;
		fs.writeFileSync(filePath, newContent, "utf-8");

		fixedCount++;
		console.log(
			`${COLORS.yellow}  📄 fixed: ${relativePath}${COLORS.reset}`,
		);
		console.log(`${COLORS.gray}     title: "${title}"${COLORS.reset}`);
		console.log(`${COLORS.gray}     published: ${published} (draft: true)${COLORS.reset}`);
	} catch (err) {
		errorCount++;
		console.error(
			`${COLORS.red}  ❌ 出错: ${relativePath} - ${err.message}${COLORS.reset}`,
		);
	}
}

// 汇总
console.log(`\n${COLORS.cyan}════════════════════════════════════${COLORS.reset}`);
console.log(`${COLORS.green}  ✅ 已修复: ${fixedCount} 个文件${COLORS.reset}`);
console.log(`${COLORS.gray}  ℹ️  已合法: ${alreadyValidCount} 个文件${COLORS.reset}`);
if (errorCount > 0) {
	console.log(`${COLORS.red}  ❌ 失败: ${errorCount} 个文件${COLORS.reset}`);
}

console.log(`\n${COLORS.yellow}⚠️  所有修复的文件均为 draft: true（草稿状态）${COLORS.reset}`);
console.log(`${COLORS.yellow}   发表前请逐个改为 draft: false${COLORS.reset}`);
