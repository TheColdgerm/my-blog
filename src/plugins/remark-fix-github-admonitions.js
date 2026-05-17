/**
 * remark-fix-github-admonitions.js
 *
 * 功能：将 Obsidian/GitHub 风格的 callout 语法转换为 Markdown 指令。
 *
 * 支持的语法（完整 Obsidian callout 语法）：
 *
 * 1. 基础类型
 *    > [!note]
 *    > content
 *
 * 2. 自定义标题
 *    > [!tip] 我的提示标题
 *    > content
 *
 * 3. 可折叠 callout（支持 - 和 + 修饰符，渲染效果相同）
 *    > [!example]- 折叠示例
 *    > content
 *
 * 4. 支持的 Obsidian callout 类型及映射：
 *    note, abstract, summary, tldr, info, todo  → note (蓝色)
 *    tip, hint, example                           → tip (青色)
 *    important                                     → important (紫色)
 *    success, check, done                          → tip (青色)
 *    question, help, faq                           → note (蓝色)
 *    warning, caution, attention, failure, fail, missing → warning (黄色)
 *    danger, error, bug                            → caution (红色)
 *    quote, cite                                   → note (蓝色)
 */

import { visit } from "unist-util-visit";

/**
 * 匹配 Obsidian callout 声明行的正则
 *
 * 格式：> [!TYPE] 或 > [!TYPE]- 或 > [!TYPE]+ 或 > [!TYPE] 自定义标题
 *
 * 分组：
 *   type:      callout 类型（如 note, tip, warning）
 *   foldable:  可选的可折叠标记（- 或 +）
 *   title:     可选的自定义标题
 */
const CALLOUT_DECLARATION_REGEX =
	/^\s*\[\!(?<type>\w+)\]\s*(?<foldable>[-+])?\s*(?<title>.*)?$/;

/**
 * 所有支持的 Obsidian callout 类型（大写）
 * 完整列表参考 https://help.obsidian.md/Editing+and+formatting/Callouts
 */
const ALL_CALLOUT_TYPES = [
	"NOTE",
	"ABSTRACT",
	"SUMMARY",
	"TLDR",
	"INFO",
	"TODO",
	"TIP",
	"HINT",
	"IMPORTANT",
	"SUCCESS",
	"CHECK",
	"DONE",
	"QUESTION",
	"HELP",
	"FAQ",
	"WARNING",
	"CAUTION",
	"ATTENTION",
	"FAILURE",
	"FAIL",
	"MISSING",
	"DANGER",
	"ERROR",
	"BUG",
	"EXAMPLE",
	"QUOTE",
	"CITE",
];

/**
 * Obsidian callout 类型 → 现有 admonition CSS class 映射
 * 将所有 Obsidian 类型映射到现有的 5 种样式
 */
const TYPE_TO_ADMONITION_MAP = {
	NOTE: "note",
	ABSTRACT: "note",
	SUMMARY: "note",
	TLDR: "note",
	INFO: "note",
	TODO: "note",
	TIP: "tip",
	HINT: "tip",
	IMPORTANT: "important",
	SUCCESS: "tip",
	CHECK: "tip",
	DONE: "tip",
	QUESTION: "note",
	HELP: "note",
	FAQ: "note",
	WARNING: "warning",
	CAUTION: "warning",
	ATTENTION: "warning",
	FAILURE: "warning",
	FAIL: "warning",
	MISSING: "warning",
	DANGER: "caution",
	ERROR: "caution",
	BUG: "caution",
	EXAMPLE: "tip",
	QUOTE: "note",
	CITE: "note",
};

/**
 * 解析 callout 声明行
 *
 * @param {string} text 声明行文本（如 "[!note] 自定义标题" 或 "[!tip]-"）
 * @returns {{ type: string|null, title: string|null, foldable: boolean }}
 */
function parseCalloutDeclaration(text) {
	const match = text.match(CALLOUT_DECLARATION_REGEX);
	if (!match) {
		return { type: null, title: null, foldable: false };
	}

	const rawType = match.groups.type?.toUpperCase();
	if (!rawType || !ALL_CALLOUT_TYPES.includes(rawType)) {
		return { type: null, title: null, foldable: false };
	}

	const admonitionType = TYPE_TO_ADMONITION_MAP[rawType] || "note";
	const title = match.groups.title?.trim() || null;
	const foldable = !!match.groups.foldable;

	return { type: admonitionType, title, foldable };
}

export function remarkFixGithubAdmonitions() {
	return (tree) => {
		visit(tree, "blockquote", (node, index, parent) => {
			if (!parent || index === undefined) {
				return;
			}

			const firstChild = node.children[0];
			if (firstChild?.type !== "paragraph") {
				return;
			}

			const firstParagraphChild = firstChild.children[0];
			if (firstParagraphChild?.type !== "text") {
				return;
			}

			// 获取第一行文本作为 callout 声明
			const possibleDeclaration =
				firstParagraphChild.value.split("\n")[0];
			if (!possibleDeclaration) {
				return;
			}

			const { type, title, foldable } =
				parseCalloutDeclaration(possibleDeclaration);
			if (!type) {
				return;
			}

			// ---- 构建 directive 子节点 ----

			// 1. 处理声明行后的剩余文本内容
			const lines = firstParagraphChild.value.split("\n");
			const remainingText =
				lines.length > 1
					? lines.slice(1).join("\n").trimStart()
					: "";

			const textNodeChildren = remainingText
				? [{ type: "text", value: remainingText }]
				: [];

			const paragraphChildren = [
				...textNodeChildren,
				...firstChild.children.slice(1),
			];

			// 2. 如果存在自定义标题，生成标题文本节点
			const directiveChildren = [];

			if (title) {
				// 使用 directive label 语法来标记标题
				// label 是一个 paragraph，其 data.directiveLabel = true
				// (parseDirectiveNode 检查 node.children[0].data.directiveLabel)
				directiveChildren.push({
					type: "paragraph",
					data: {
						directiveLabel: true,
					},
					children: [
						{
							type: "text",
							value: title,
						},
					],
				});
			}

			// 3. 添加段落内容（声明行后的剩余内容 + 同一段落的其他节点）
			if (paragraphChildren.length > 0) {
				directiveChildren.push({
					type: "paragraph",
					children: paragraphChildren,
				});
			}

			// 4. 添加 blockquote 中剩余的兄弟节点（如后续段落、列表等）
			for (let i = 1; i < node.children.length; i++) {
				directiveChildren.push(node.children[i]);
			}

			// 构建 containerDirective 节点
			const directive = {
				type: "containerDirective",
				name: type, // 使用映射后的类型名（note/tip/warning 等）
				attributes: foldable ? { foldable: "" } : {},
				children: directiveChildren,
			};

			parent.children[index] = directive;
		});
	};
}
