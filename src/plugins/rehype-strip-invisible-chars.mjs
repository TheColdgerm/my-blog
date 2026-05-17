/**
 * rehype-strip-invisible-chars.mjs
 *
 * 功能：在 KaTeX 处理之前，从 HAST 文本节点中移除不可见字符。
 * 作为 remark 版本的双重保障，因为数学公式 $...$ 被 remarkMath
 * 转换为 inlineMath 节点后，remark 文本节点清理插件无法触及。
 *
 * 当前处理的字符：
 * - U+200B 零宽空格（Zero Width Space）
 * - U+200C 零宽非连接符
 * - U+200D 零宽连接符
 * - U+FEFF 字节顺序标记 / 零宽不换行空格
 * - U+00AD 软连字符
 */

import { visit } from "unist-util-visit";

const INVISIBLE_CHARS_REGEX = /[\u200B\u200C\u200D\uFEFF\u00AD]/g;

export function rehypeStripInvisibleChars() {
	return (tree) => {
		visit(tree, "text", (node) => {
			if (node.value && INVISIBLE_CHARS_REGEX.test(node.value)) {
				INVISIBLE_CHARS_REGEX.lastIndex = 0;
				node.value = node.value.replace(INVISIBLE_CHARS_REGEX, "");
			}
		});
	};
}
