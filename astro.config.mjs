import sitemap from "@astrojs/sitemap";
import mdx from '@astrojs/mdx';
import svelte, { vitePreprocess } from "@astrojs/svelte";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { oddmisc } from "oddmisc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";

import { siteConfig } from "./src/config.ts";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { rehypeImageWidth } from "./src/plugins/rehype-image-width.mjs";
import { rehypeMermaid } from "./src/plugins/rehype-mermaid.mjs";
import { rehypeObsidianWikilink } from "./src/plugins/rehype-obsidian-wikilink.mjs";
import { rehypeStripInvisibleChars } from "./src/plugins/rehype-strip-invisible-chars.mjs";
import { rehypeWrapTable } from "./src/plugins/rehype-wrap-table.mjs";
import { remarkContent } from "./src/plugins/remark-content.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkFixGithubAdmonitions } from "./src/plugins/remark-fix-github-admonitions.js";
import { remarkMermaid } from "./src/plugins/remark-mermaid.js";
import { remarkObsidianComment } from "./src/plugins/remark-obsidian-comment.mjs";
import { remarkObsidianWikilink } from "./src/plugins/remark-obsidian-wikilink.mjs";
import { remarkStripInvisibleChars } from "./src/plugins/remark-strip-invisible-chars.mjs";

// https://astro.build/config
export default defineConfig({
	site: siteConfig.siteURL,
	base: "/",
	trailingSlash: "always",

	output: "static",

	integrations: [
		oddmisc({
			umami: {
				shareUrl: false,
			},
		}),
		swup({
			theme: false,
			animationClass: "transition-swup-",
			containers: ["main"],
			smoothScrolling: false, // 禁用平滑滚动以提升性能，避免与锚点导航冲突
			cache: true,
			preload: false, // 禁用预加载以提升性能
			accessibility: true,
			updateHead: process.env.NODE_ENV === "production",
			updateBodyClass: false,
			globalInstance: true,
			// 滚动相关配置优化
			resolveUrl: (url) => url,
			animateHistoryBrowsing: false,
			skipPopStateHandling: (event) => {
				// 跳过锚点链接的处理，让浏览器原生处理
				return (
					event.state &&
					event.state.url &&
					event.state.url.includes("#")
				);
			},
		}),
		icon(),
		expressiveCode({
			themes: ["github-light", "github-dark"],
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				pluginLanguageBadge(),
				pluginCustomCopyButton(),
			],
			defaultProps: {
				wrap: true,
				overridesByLang: {
					shellsession: { showLineNumbers: false },
					bash: { frame: "code" },
					shell: { frame: "code" },
					sh: { frame: "code" },
					zsh: { frame: "code" },
				},
			},
			styleOverrides: {
				codeBackground: "var(--codeblock-bg)",
				borderRadius: "0.75rem",
				borderColor: "none",
				codeFontSize: "0.875rem",
				codeFontFamily:
					"'JetBrains Mono Variable', SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', 'Microsoft JhengHei', '微軟正黑體', 'Microsoft YaHei', '微软雅黑', 'Noto Sans HK', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans KR', ui-monospace, monospace",
				codeLineHeight: "1.5rem",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					terminalTitlebarBackground: "var(--codeblock-bg)",
					editorTabBarBackground: "var(--codeblock-bg)",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "var(--primary)",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "var(--codeblock-bg)",
					terminalTitlebarBorderBottomColor: "none",
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
		svelte({
			preprocess: vitePreprocess(),
		}),
		sitemap(),
		mdx(),
	],
	markdown: {
		remarkPlugins: [
			// 预处理：先清理不可见字符，再处理 Obsidian 语法
			remarkStripInvisibleChars, // 移除零宽空格等不可见字符（防止 KaTeX 刷屏）
			remarkObsidianComment, // 移除 %% 注释
			remarkObsidianWikilink, // 转换 [[双链]] 为 Markdown 链接
			remarkMath,
			remarkContent,
			remarkFixGithubAdmonitions,
			remarkDirective,
			remarkSectionize,
			parseDirectiveNode,
			remarkMermaid,
		],
		rehypePlugins: [
			rehypeStripInvisibleChars, // 在 KaTeX 之前清理不可见字符
			[
				rehypeKatex,
				{
					// 兼容 Obsidian 中 $中文术语$ 的用法。
					// 在数学笔记中常见 $定义域$、$基本不定积分$ 等中文文本包裹在 $ 内。
					// strict: false 禁止 KaTeX 对这些"非标准 LaTeX 输入"发出警告
					strict: false,
					// throwOnError: false 让 KaTeX 渲染失败时显示原始文本而不是抛出异常
					throwOnError: false,
				},
			],
			[
				rehypeExternalLinks,
				{
					target: "_blank",
					rel: ["nofollow", "noopener", "noreferrer"],
				},
			],
			rehypeSlug,
			rehypeWrapTable,
			rehypeMermaid,
			[
				rehypeComponents,
				{
					components: {
						github: GithubCardComponent,
						note: (x, y) => AdmonitionComponent(x, y, "note"),
						tip: (x, y) => AdmonitionComponent(x, y, "tip"),
						important: (x, y) =>
							AdmonitionComponent(x, y, "important"),
						caution: (x, y) => AdmonitionComponent(x, y, "caution"),
						warning: (x, y) => AdmonitionComponent(x, y, "warning"),
					},
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					behavior: "append",
					properties: {
						className: ["anchor"],
					},
					content: {
						type: "element",
						tagName: "span",
						properties: {
							className: ["anchor-icon"],
							"data-pagefind-ignore": true,
						},
						children: [{ type: "text", value: "#" }],
					},
				},
			],
			rehypeImageWidth,
			rehypeObsidianWikilink,
		],
	},
	vite: {
		plugins: [tailwindcss()],
		// 开发环境预打包优化：将常用依赖提前编译，避免首次页面加载时 on-demand 编译导致 8s+ 的等待
		optimizeDeps: {
			include: [
				"@iconify/svelte",
				"svelte",
				"svelte/transition",
				"svelte/easing",
				"overlayscrollbars",
				"@fancyapps/ui",
				"marked",
				"sanitize-html",
				"qrcode",
			],
		},
		// 预热常用入口文件，让 Vite 在服务器启动后立即开始转换，而不是等到浏览器请求
		server: {
			warmup: {
				clientFiles: [
					"src/layouts/Layout.astro",
					"src/pages/index.astro",
					"src/components/widgets/music-player/MusicPlayer.svelte",
					"src/components/organisms/navigation/Search.svelte",
					"src/components/control/ThemeSwitch.svelte",
					"src/components/features/settings/DisplaySettings.svelte",
					"src/scripts/swup-manager.ts",
				],
			},
		},
		build: {
			// 静态资源处理优化，防止小图片转 base64 导致 HTML 体积过大
			assetsInlineLimit: 4096,
			// CSS 代码分割
			cssCodeSplit: true,
			cssMinify: "esbuild",
			// 内联小型 CSS 文件以减少网络请求
			inlineStylesheets: "auto",
			// 生产环境移除 console 和 debugger
			minify: "esbuild",
			rollupOptions: {
				onwarn(warning, warn) {
					if (
						warning.message.includes(
							"is dynamically imported by",
						) &&
						warning.message.includes(
							"but also statically imported by",
						)
					) {
						return;
					}
					warn(warning);
				},
			},
		},
		// 生产环境移除 console.log 和 debugger
		esbuildOptions: {
			drop:
				process.env.NODE_ENV === "production"
					? ["console", "debugger"]
					: [],
		},
	},
});
