/**
 * 测试脚本：验证 Obsidian 兼容插件的核心逻辑
 * 运行：node scripts/test-obsidian-plugins.mjs
 *
 * 注意：由于 remark-stringify 不在依赖中，我们直接测试核心正则逻辑
 */
import { remarkObsidianComment } from "../src/plugins/remark-obsidian-comment.mjs";
import { remarkObsidianWikilink } from "../src/plugins/remark-obsidian-wikilink.mjs";

let passed = 0;
let failed = 0;

function assert(name, actual, expected) {
	const actualStr = String(actual);
	const expectedStr = String(expected);
	if (actualStr === expectedStr) {
		console.log(`  ✅ ${name}`);
		passed++;
	} else {
		console.log(`  ❌ ${name}`);
		console.log(`     期望: ${JSON.stringify(expectedStr)}`);
		console.log(`     实际: ${JSON.stringify(actualStr)}`);
		failed++;
	}
}

function assertContains(name, actual, expected) {
	const actualStr = String(actual);
	if (actualStr.includes(expected)) {
		console.log(`  ✅ ${name}`);
		passed++;
	} else {
		console.log(`  ❌ ${name}`);
		console.log(`     期望包含: ${JSON.stringify(expected)}`);
		console.log(`     实际: ${JSON.stringify(actualStr)}`);
		failed++;
	}
}

function assertNotContains(name, actual, expected) {
	const actualStr = String(actual);
	if (!actualStr.includes(expected)) {
		console.log(`  ✅ ${name}`);
		passed++;
	} else {
		console.log(`  ❌ ${name}`);
		console.log(`     期望不包含: ${JSON.stringify(expected)}`);
		console.log(`     实际: ${JSON.stringify(actualStr)}`);
		failed++;
	}
}

console.log("\n========== 插件导入验证 ==========");
assert("remarkObsidianComment 是函数", typeof remarkObsidianComment, "function");
assert("remarkObsidianWikilink 是函数", typeof remarkObsidianWikilink, "function");

console.log("\n========== %% 注释移除测试 (正则逻辑) ==========");
const COMMENT_REGEX = /%%[\s\S]*?%%/g;

function removeComments(text) {
	return text.replace(COMMENT_REGEX, "");
}

// 测试 1: 行内注释
assert("内联 %% 注释", removeComments("正文%%注释%%继续"), "正文继续");

// 测试 2: 多行注释
assert("多行 %% 注释", removeComments("a%%\nb\n%%c"), "ac");

// 测试 3: 连续注释
assert("连续 %% 注释", removeComments("a%%x%%b%%y%%c"), "abc");

// 测试 4: 无注释
assert("无注释文本不变", removeComments("普通文本"), "普通文本");

// 测试 5: 整段注释（剩余空行是正常的 Markdown 段落分隔）
assert("整段注释: %% 被移除", removeComments("前置\n%%%%\n后置").includes("%%"), false);
assert("整段注释: 内容保留", removeComments("前置\n%%%%\n后置").includes("前置"), true);
assert("整段注释: 内容保留", removeComments("前置\n%%%%\n后置").includes("后置"), true);

// 测试 6: 特殊字符
assert("注释含特殊字符", removeComments("a%%<script>%%b"), "ab");

console.log("\n========== Wikilink 转换测试 (正则逻辑) ==========");
const WIKILINK_REGEX = /(!?)\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;

function convertWikilinks(text) {
	return text.replace(WIKILINK_REGEX, (match, isEmbed, target, alias) => {
		const IMAGE_EXTS = new Set([
			".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".tiff", ".tif", ".ico",
		]);
		const ext = target.substring(target.lastIndexOf(".")).toLowerCase();
		const isImage = IMAGE_EXTS.has(ext);

		if (isEmbed === "!" && isImage) {
			const alt = alias ? `${target} (${alias})` : target;
			return `![${alt}](/images/from-obsidian/${encodeURIComponent(target)})`;
		} else if (isEmbed === "!") {
			const text = alias || target;
			return `[${text}](/attachments/${encodeURIComponent(target)})`;
		} else {
			const displayText = alias || target;
			function slugify(t) {
				let name = t.replace(/\.[^.]+$/, "");
				return name.toLowerCase()
					.replace(/[^\w\u4e00-\u9fff]+/g, "-")
					.replace(/^-+|-+$/g, "");
			}
			const slug = slugify(target);
			return `[${displayText}](/posts/${slug}/)`;
		}
	});
}

// 测试: [[页面]]
assertContains("[[页面]] 转链接", convertWikilinks("[[笔记一]]"), "/posts/笔记一/");
assertContains("[[页面]] 显示文本", convertWikilinks("[[笔记一]]"), "[笔记一]");

// 测试: [[页面|别名]]
assertContains("[[页面|别名]]", convertWikilinks("[[note|查看详情]]"), "[查看详情]");

// 测试: ![[图片]]
assertContains("![[图片.png]]", convertWikilinks("![[photo.png]]"), "/images/from-obsidian/photo.png");
assertContains("![[图片.webp]]", convertWikilinks("![[photo.webp]]"), "/images/from-obsidian/photo.webp");
assertNotContains("![[图片]] 不含附件路径", convertWikilinks("![[photo.png]]"), "/attachments/");

// 测试: ![[图片|尺寸]]
assertContains("![[图片|尺寸]]", convertWikilinks("![[photo.png|200]]"), "photo.png (200)");

// 测试: ![[附件.pdf]]
assertNotContains("![[附件.pdf]] 不是图片路径", convertWikilinks("![[doc.pdf]]"), "/images/from-obsidian/");
assertContains("![[附件.pdf]] 是附件路径", convertWikilinks("![[doc.pdf]]"), "/attachments/");

// 测试: 混合文本
const mixedResult = convertWikilinks("参考 [[笔记A]] 和 ![[figure.png]]");
assertContains("混合文本: 双链", mixedResult, "[笔记A]");
assertContains("混合文本: 图片", mixedResult, "/images/from-obsidian/figure.png");

console.log("\n========== 汇总 ==========");
console.log(`${passed} 通过, ${failed} 失败, 共 ${passed + failed} 项`);
if (failed > 0) {
	console.log("❌ 部分测试失败");
	process.exit(1);
} else {
	console.log("✅ 所有测试通过！");
}
