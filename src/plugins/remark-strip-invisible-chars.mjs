/**
 * remark-strip-invisible-chars.mjs
 *
 * 功能：从 Markdown 文本中移除不可见字符（零宽空格等），
 * 防止 KaTeX 等下游插件报 "No character metrics" 警告。
 *
 * 当前处理的字符：
 * - U+200B 零宽空格（Zero Width Space）
 * - U+200C 零宽非连接符（Zero Width Non-Joiner）
 * - U+200D 零宽连接符（Zero Width Joiner）
 * - U+FEFF 字节顺序标记 / 零宽不换行空格（BOM / ZWNBSP）
 * - U+00AD 软连字符（Soft Hyphen）
 */

import { visit } from "unist-util-visit";

// 匹配所有需要移除的不可见字符
const INVISIBLE_CHARS_REGEX = /[\u200B\u200C\u200D\uFEFF\u00AD]/g;

export function remarkStripInvisibleChars() {
	return (tree) => {
		visit(tree, "text", (node) => {
			if (node.value && INVISIBLE_CHARS_REGEX.test(node.value)) {
				// reset lastIndex because test() advances it with /g
				INVISIBLE_CHARS_REGEX.lastIndex = 0;
				node.value = node.value.replace(INVISIBLE_CHARS_REGEX, "");
			}
		});

		// 也清理代码块中的不可见字符（inlineCode 和 code）
		visit(tree, "inlineCode", (node) => {
			if (node.value && INVISIBLE_CHARS_REGEX.test(node.value)) {
				INVISIBLE_CHARS_REGEX.lastIndex = 0;
				node.value = node.value.replace(INVISIBLE_CHARS_REGEX, "");
			}
		});

		visit(tree, "code", (node) => {
			if (node.value && INVISIBLE_CHARS_REGEX.test(node.value)) {
				INVISIBLE_CHARS_REGEX.lastIndex = 0;
				node.value = node.value.replace(INVISIBLE_CHARS_REGEX, "");
			}
		});
	};
}
