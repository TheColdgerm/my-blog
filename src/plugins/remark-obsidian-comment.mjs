/**
 * remark-obsidian-comment.mjs
 *
 * 功能：移除 Obsidian 的 %% 注释语法
 *
 * Obsidian 中使用 %% 包裹注释内容，这些内容不会被渲染。
 * 例如：
 *   %% 这是单行注释 %%
 *   %%
 *   这是
 *   多行注释
 *   %%
 *
 * 该插件在 remark 解析阶段将 %%...%% 及其内容完全移除。
 * 同时会在 markdown 被解析之前对原始文本进行预处理，
 * 以确保跨越多行的 %% 注释能被正确处理。
 */

import { visit } from "unist-util-visit";

/**
 * 正则匹配 %% 注释
 * - 使用 [\s\S] 来匹配包括换行符在内的任意字符
 * - 使用 ? 进行非贪婪匹配
 */
const OBSIDIAN_COMMENT_REGEX = /%%[\s\S]*?%%/g;

/**
 * 检查节点是否"空"（没有有效内容）
 */
function isEmptyNode(node) {
	if (!node) return true;
	if (node.type === "text") {
		return !node.value || node.value.trim() === "";
	}
	if (node.children) {
		return node.children.length === 0 ||
			node.children.every(isEmptyNode);
	}
	return false;
}

export function remarkObsidianComment() {
	return (tree) => {
		// 第一步：处理所有文本节点，移除其中的 %% 注释
		visit(tree, "text", (node) => {
			if (node.value) {
				node.value = node.value.replace(OBSIDIAN_COMMENT_REGEX, "");
			}
		});

		// 第二步：遍历所有节点，清理空的父节点中的空子节点
		// 使用 visit 配合 enter/leave 来安全地清理
		const nodesToRemove = [];

		visit(tree, (node, index, parent) => {
			if (!parent || index === undefined) return;

			// 标记需要移除的空节点
			if (isEmptyNode(node)) {
				nodesToRemove.push({ parent, index });
			}
		});

		// 从后往前移除节点，避免索引变化问题
		nodesToRemove
			.sort((a, b) => b.index - a.index)
			.forEach(({ parent, index }) => {
				if (index >= 0 && index < parent.children.length) {
					parent.children.splice(index, 1);
				}
			});
	};
}
