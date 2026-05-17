import type {
	AnnouncementConfig,
	CommentConfig,
	ExpressiveCodeConfig,
	FooterConfig,
	FullscreenWallpaperConfig,
	LicenseConfig,
	MusicPlayerConfig,
	NavBarConfig,
	PermalinkConfig,
	ProfileConfig,
	RandomPostsConfig,
	RelatedPostsConfig,
	SakuraConfig,
	ShareConfig,
	SidebarLayoutConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

// ============================================================
// 站点全局配置 (siteConfig)
// 这是整个网站最核心的配置文件，几乎涵盖所有全局行为
// ============================================================

// 移除i18n导入以避免循环依赖

// ============================================================
// 定义站点语言和时区
// ============================================================
const SITE_LANG = "zh_CN"; // 语言代码
// 可用的语言选项：
//   "en"    = 英语 (English)
//   "zh_CN" = 简体中文
//   "zh_TW" = 繁体中文
//   "ja"    = 日语 (日本語)
// 修改此项会切换整个站点的界面语言

const SITE_TIMEZONE = 8;
// 时区设置，范围为 -12 到 +12
// 中国标准时间 (UTC+8) = 8
// 日本标准时间 (UTC+9) = 9
// 美国东部时间 (UTC-5) = -5
// 影响：文章发布日期显示、存档页面时间归类等

export const siteConfig: SiteConfig = {
	// ============================================================
	// 基本信息
	// ============================================================
	title: "Wander&seek",
	// 网站标题，会显示在浏览器标签页标题中
	// 也用于 SEO 的 <title> 标签

	subtitle: "One demo website",
	// 网站副标题/描述，显示在首页横幅区域
	// 建议用一句话描述你的博客

	siteURL: "https://wander-seek.asia/",
	// 【重要】你的网站正式域名，**必须以斜杠结尾**
	// 用于生成 RSS/Atom 订阅源中的链接、SEO canonical URL、Open Graph 图片链接等
	// 示例: "https://example.com/"

	siteStartDate: "2026-05-16",
	// 网站开始运行的日期（格式: YYYY-MM-DD）
	// 侧边栏"站点统计"组件会以此日期计算"网站已运行 XX 天"

	timeZone: SITE_TIMEZONE,
	// 时区（使用上面定义的 SITE_TIMEZONE 变量）
	// 影响文章发布时间、存档页面等

	lang: SITE_LANG,
	// 语言（使用上面定义的 SITE_LANG 变量）
	// 影响界面文字、日期格式等

	// ============================================================
	// 主题颜色配置
	// ============================================================
	themeColor: {
		hue: 240,
		// 主题色的色相值 (Hue)，范围 0~360
		// 这是 HSL 颜色模型中的 H 值
		//   0   = 红色 (Red)
		//   30  = 橙色 (Orange)
		//   60  = 黄色 (Yellow)
		//   120 = 绿色 (Green)
		//   180 = 青色 (Cyan)
		//   200 = 青色偏蓝
		//   240 = 蓝色 (Blue)
		//   250 = 蓝紫色 (Indigo)
		//   270 = 紫色 (Purple)
		//   300 = 品红 (Magenta)
		//   345 = 粉色 (Pink)
		// 建议选一个你喜欢的颜色作为网站主色调

		fixed: false,
		// 是否"固定"主题色
		// true  =  visitors 无法更改颜色，不显示颜色选择器
		// false =  visitors 可以通过设置面板自由切换色相
	},

	// ============================================================
	// 特色功能页面开关
	// 用不到的功能可以直接关闭，有助于提升 SEO 评分
	// 关闭后对应的路由不再生成，也请在导航栏中移除对应链接
	// ============================================================
	featurePages: {
		anime: true,
		// 番剧追踪页面 (/anime/)
		// 可以展示你正在看/看过的番剧列表

		diary: true,
		// 日记/随想页面 (/diary/)
		// 发布简短的日常动态

		friends: true,
		// 友链页面 (/friends/)
		// 展示友情链接

		projects: true,
		// 项目展示页面 (/projects/)
		// 展示你做的项目

		skills: true,
		// 技能树页面 (/skills/)
		// 展示你的技术栈和能力

		timeline: true,
		// 时间线页面 (/timeline/)
		// 按时间线展示你的人生/工作经历

		albums: true,
		// 相册页面 (/albums/)
		// 展示照片/图片集

		devices: true,
		// 设备展示页面 (/devices/)
		// 展示你拥有的数码设备
	},

	// ============================================================
	// 顶部导航栏标题配置
	// ============================================================
	navbarTitle: {
		mode: "text-icon",
		// 标题显示模式：
		//   "text-icon" = 图标 + 文字（左侧图标，右侧文字）
		//   "logo"      = 仅显示 Logo 图片

		text: "Wander&seek",
		// 导航栏标题文字（mode 为 "text-icon" 时显示）
		// 可以写你的站点名称或品牌名

		icon: "assets/home/home.webp",
		// 标题旁边的图标路径（mode 为 "text-icon" 时显示）
		// 相对于 /public 目录，会自动在前面补 /
		// 建议使用 32x32 或 48x48 的图片

		logo: "assets/home/default-logo.webp",
		// 网站 Logo 图片路径（mode 为 "logo" 时显示）
		// 会替代文字标题成为顶栏中央的标识
	},

	// ============================================================
	// 页面自动缩放配置
	// 当浏览器窗口宽度小于目标宽度时，自动缩放页面内容
	// 类似于一些应用的控制台缩放效果
	// ============================================================
	pageScaling: {
		enable: true,
		// 是否开启自动缩放功能
		// 开启后页面会根据窗口宽度自动适配

		targetWidth: 2000,
		// 目标基准宽度（像素）
		// 实际窗口宽度 = targetWidth 时，缩放比例为 100%
		// 窗口变窄时，内容会等比缩小
		// 如果你的设计稿宽度是 1920，可以改为 1920
	},

	// ============================================================
	// Bangumi 番剧追踪配置
	// Bangumi.tv 是一个番剧/动画评分追踪网站
	// ============================================================
	bangumi: {
		userId: "your-bangumi-id",
		// 【必填】你的 Bangumi 用户 ID
		// 可以去 bangumi.tv 查看你的个人主页 URL 中的数字 ID
		// 测试用 ID: "sai"（Bangumi 官方账号）
		// 获取方式：登录 Bangumi → 点击个人头像 → 地址栏数字即为 ID

		fetchOnDev: false,
		// 是否在开发环境中拉取 Bangumi 数据
		// true  = 每次 dev 启动时拉取
		// false = 仅在生产构建 (pnpm build) 时拉取
		// 建议保持 false，减少开发时的 API 请求
	},

	// ============================================================
	// Bilibili 配置
	// 用于获取你的 B站观看进度、追番列表等
	// ============================================================
	bilibili: {
		vmid: "481711062",
		// 【必填】你的 Bilibili 用户 UID
		// 打开 B站 → 个人空间 → 地址栏 "space.bilibili.com/数字" 中的数字
		// 示例: "1129280784"

		fetchOnDev: false,
		// 是否在开发环境中拉取 Bilibili 数据
		// 建议保持 false

		coverMirror: "",
		// 封面图片镜像源（可选）
		// 因为 Bilibili 图片在国内访问正常，但部署在海外服务器时可能加载慢
		// 可以使用图片代理服务，例如: "https://images.weserv.nl/?url="
		// 留空表示不使用镜像

		useWebp: true,
		// 是否将封面图片转为 WebP 格式
		// true  = 使用 WebP（更小体积，更快加载）
		// false = 使用原始格式
		// 建议保持 true
	},

	// ============================================================
	// 番剧页面模式配置
	// ============================================================
	anime: {
		mode: "local",
		// 番剧页面数据来源模式：
		//   "bangumi"  = 使用 Bangumi API（需要配置上方 bangumi.userId）
		//   "local"    = 使用本地静态数据（src/data/anime.ts）
		//   "bilibili" = 使用 Bilibili API（需要配置上方 bilibili.vmid）
		// 建议：数据量小用 "local"，想自动同步用 "bangumi" 或 "bilibili"
	},

	// ============================================================
	// 日记页面 Memos API 地址
	// ============================================================
	diaryApiUrl: "",
	// 日记页面数据源 API 地址
	// 留空      = 使用本地静态数据（src/data/diary.ts）
	// 填写 URL  = 从该 API 拉取数据（需符合特定格式）
	// 如果你部署了自托管的 Memos 服务（usememos.com），可以填入其 API 地址
	// 示例: "https://memos.example.com/api/v1/memos"

	// ============================================================
	// 文章列表布局配置
	// ============================================================
	postListLayout: {
		defaultMode: "list",
		// 默认文章列表布局模式：
		//   "list" = 列表模式（单列，每篇文章占一整行）
		//   "grid" = 网格模式（双列，卡片式排列，类似 Masonry）
		// ⚠️ 注意：如果侧边栏启用了"双侧边栏(both)"模式，
		//   文章列表区域变窄，将无法使用 grid（网格双列）布局

		allowSwitch: true,
		// 是否允许用户在页面上手动切换列表/网格布局
		// true  = 显示布局切换按钮
		// false = 固定使用 defaultMode

		categoryBar: {
			enable: true,
			// 是否在文章列表顶部显示分类导航条
			// 开启后用户可按分类筛选文章
		},
	},

	// ============================================================
	// 标签样式配置
	// ============================================================
	tagStyle: {
		useNewStyle: false,
		// 标签样式选择：
		// true  = 使用新样式：悬停时才高亮（鼠标移上去才变色）
		// false = 使用旧样式：始终有边框常亮显示
		// 建议：选你视觉上喜欢的
	},

	// ============================================================
	// 壁纸模式配置
	// ============================================================
	wallpaperMode: {
		defaultMode: "banner",
		// 默认壁纸显示模式：
		//   "banner"     = 顶部横幅壁纸（首页大图）
		//   "fullscreen" = 全屏壁纸（背景铺满整个页面）
		//   "none"       = 无壁纸（纯色背景）

		showModeSwitchOnMobile: "desktop",
		// 在哪些设备上显示"切换布局方案"的按钮
		//   "off"     = 不显示切换按钮
		//   "mobile"  = 仅在手机端显示
		//   "desktop" = 仅在电脑端显示
		//   "both"    = 所有设备都显示
	},

	// ============================================================
	// 横幅 (Banner) 配置
	// 即页面顶部的 hero 大图区域
	// ============================================================
	banner: {
		src: {
			// 横幅图片来源配置，支持单张或多张图片
			desktop: [
				"/assets/desktop-banner/wallhaven-1qrkv1.jpg",
				"/assets/desktop-banner/wallhaven-gw9o2l.png",
				"/assets/desktop-banner/wallhaven-jek6dp.png",
				"/assets/desktop-banner/wallhaven-jev1dy.png",
				"/assets/desktop-banner/wallhaven-gw93de.png",
			],
			// 电脑端横幅图片（一般 1920x1080 左右比较合适）
			// 图片路径相对于 /public 目录
			// 可以放多张实现轮播，也可以只放一张

			mobile: [
				"/assets/mobile-banner/1.webp",
				"/assets/mobile-banner/2.webp",
				"/assets/mobile-banner/3.webp",
				"/assets/mobile-banner/4.webp",
			],
			// 手机端横幅图片（一般 750x1334 左右比较合适）
			// 手机端和电脑端可以分别使用不同的图片
		},

		position: "center",
		// 图片定位方式，等同于 CSS 的 object-position
		// 可选值：'top' | 'center' | 'bottom'
		// 如果你的图片焦点在中间就选 'center'
		// 焦点在上方就选 'top'

		carousel: {
			enable: true,
			// 轮播功能（仅当图片数组长度 > 1 时有效）
			// true  = 按时间间隔自动轮播切换图片
			// false = 每次刷新页面随机显示一张图片

			interval: 3,
			// 轮播切换间隔（单位：秒）
			// 建议 3~5 秒，太短来不及看，太长显得呆板
		},

		waves: {
			enable: true,
			// 是否在横幅底部显示波浪动画效果
			// ⚠️ 此效果对性能有一定开销，低配设备可能卡顿

			performanceMode: false,
			// 性能模式开关
			// true  = 降低动画复杂度，性能提升约 40%
			// false = 完整波浪效果

			mobileDisable: false,
			// 移动端是否禁用波浪效果
			// true  = 手机端不显示波浪，节省性能
			// false = 所有设备都显示
		},

		// PicFlow API 支持（智能随机图片 API）
		imageApi: {
			enable: false,
			// 是否启用图片 API 获取随机壁纸
			// 开启后 banner 图片将从 API 获取，而非本地文件

			url: "http://domain.com/api_v2.php?format=text&count=4",
			// API 地址，需要返回格式为每行一个图片 URL 的纯文本
			// 使用 PicFlow API 项目：https://github.com/matsuzaka-yuki/PicFlow-API
			// 需要自行搭建 API 服务
			// 参数 format=text 表示纯文本返回，count=4 表示返回 4 张图
		},

		// 首页横幅文字配置
		homeText: {
			enable: true,
			// 是否在首页横幅上显示自定义文本（大标题和副标题）

			title: "Wander & seek",
			// 首页横幅主标题（大号文字展示）
			// 可以写你的博客名、座右铭等

			subtitle: [
				"敬，坚持不懈",
				"乐，与人为伴",
				"喜，知行如一",
				"愿，国泰明安",
			],
			// 副标题文字数组（可放多句，配合打字机效果循环显示）
			// 每句会依次出现，循环切换

			typewriter: {
				enable: true,
				// 是否启用打字机效果（文字逐字出现）
				// 配合 subtitle 数组可以实现多句轮流打字效果

				speed: 200,
				// 打字速度（单位：毫秒/字）
				// 数值越小打字越快
				// 100 ≈ 每秒打 10 个字

				deleteSpeed: 50,
				// 删除文字的速度（单位：毫秒/字）
				// 切换到下一句前删除当前文字的速度

				pauseTime: 3000,
				// 一句话完全显示后的停留时间（单位：毫秒）
				// 2000 = 显示 2 秒后再删除切换下一句
			},
		},

		credit: {
			enable: false,
			// 是否在横幅角落显示图片来源信息
			// 如果你用了别人的画作做壁纸，建议开启并标注来源

			text: "Describe",
			// 要显示的来源文本，例如画师名或作品名
			// 示例: "Pixiv ID 123456"

			url: "",
			// （可选）原始作品页面的 URL 链接
			// 点击来源文字会跳转到此链接
			// 示例: "https://www.pixiv.net/artworks/123456"
		},

		navbar: {
			transparentMode: "semifull",
			// 导航栏透明模式（在横幅区域时）
			//   "semi"     = 半透明 + 圆角背景（柔和过渡）
			//   "full"     = 完全透明（导航栏与横幅融为一体）
			//   "semifull" = 动态透明（滚动时从透明渐变到不透明）
		},
	},

	// ============================================================
	// 文章目录 (Table of Contents) 配置
	// ============================================================
	toc: {
		enable: true,
		// 目录功能的总体开关
		// false = 完全禁用所有目录功能

		mobileTop: true,
		// 手机端是否显示顶部目录按钮
		// 点击后以弹窗形式展示文章目录

		desktopSidebar: true,
		// 电脑端是否在右侧边栏显示目录

		floating: true,
		// 是否显示悬浮的目录按钮（固定在页面右侧的浮动按钮）
		// 点击可展开快速导航

		depth: 2,
		// 目录显示的最大标题层级
		// 1 = 只显示 h1（一级标题）
		// 2 = 显示 h1, h2（一二级标题）
		// 3 = 显示 h1, h2, h3
		// ...以此类推，最大 6

		useJapaneseBadge: false,
		// 是否使用日文假名标记代替数字编号
		// true  = 目录编号显示为 あ、い、う、え、お...
		// false = 目录编号显示为 1、2、3、4、5...
	},

	showCoverInContent: true,
	// 在文章详情页是否显示文章封面图
	// 仅对 frontmatter 中设置了 image 的文章生效

	generateOgImages: false,
	// 是否在构建时自动生成 Open Graph 图片
	// OG 图片是分享链接时显示的预览图（如分享到微信/Twitter）
	// ⚠️ 开启后构建时间会显著变长，建议仅在正式构建时开启
	// 本地开发调试时建议保持 false

	favicon: [
		// 网站图标 (Favicon) 配置
		// 留空则使用默认 favicon（位于 /public/favicon/）
		// 如果需要自定义，按以下格式配置：
		// {
		//   src: '/favicon/icon.png',     // 图标文件路径，相对于 /public
		//   theme: 'light',               // 可选，指定适配的主题 'light' | 'dark'
		//   sizes: '32x32',               // 可选，图标尺寸
		// }
		// 可以配置多个以适配不同场景
	],

	// ============================================================
	// 字体配置
	// ============================================================
	font: {
		// 字体子集化说明：
		// - 自定义字体需要在 src/styles/main.css 中用 @font-face 引入
		// - 字体子集优化（压缩）仅支持 TTF 格式字体
		// - 压缩效果只在 生产构建 (pnpm build) 后可见
		// - 在 Dev 开发环境下显示的是浏览器默认字体！

		asciiFont: {
			// ASCII 英文字体配置
			// 优先级最高的字体，用于英文和数字显示
			fontFamily: "ZenMaruGothic-Medium",
			// 字体名称（与 CSS 中的 font-family 对应）

			fontWeight: "400",
			// 字体粗细（font-weight 值）
			// 400 = normal（常规）
			// 700 = bold（粗体）

			localFonts: ["ZenMaruGothic-Medium.ttf"],
			// 本地字体文件名数组
			// 字体文件放在 public/assets/font/ 目录下
			// 构建时会基于这些文件进行子集化压缩

			enableCompress: true,
			// 是否启用字体子集压缩
			// 开启后只保留页面中实际用到的字符，大幅减小字体文件体积
		},

		cjkFont: {
			// 中日韩 (CJK) 字体配置
			// 作为英文字体的回退字体，用于中文、日文、韩文显示
			fontFamily: "萝莉体 第二版",
			// 字体名称

			fontWeight: "500",
			// 字体粗细
			// 500 = medium（中等）

			localFonts: ["loli.ttf"],
			// 本地字体文件路径

			enableCompress: true,
			// 是否启用压缩
		},
	},

	showLastModified: true,
	// 是否在文章底部显示"最后编辑时间"卡片
	// 需要文章 frontmatter 中设置了 updated 字段

	// ============================================================
	// 页面顶部阅读进度条配置
	// ============================================================
	pageProgressBar: {
		enable: true,
		// 是否启用页面顶部进度条
		// 开启后页面顶部会有一条彩色进度条，随滚动填充

		height: 3,
		// 进度条高度（单位：像素 px）
		// 建议 2~4 px，太粗影响美观，太细不易察觉

		duration: 6000,
		// 进度条动画时长（单位：毫秒 ms）
		// 指进度条颜色过渡动画的速度
		// 6000 = 6 秒完成一次颜色渐变
	},

	// ============================================================
	// 第三方分析统计配置
	// ============================================================
	thirdPartyAnalytics: {
		enable: false,
		// 是否启用 Microsoft Clarity 用户行为分析
		// ⚠️ 启用后可能影响 Lighthouse 性能评分
		// Clarity 可以记录用户点击、滚动等行为（热力图）

		clarityId: "",
		// Microsoft Clarity 项目 ID
		// 在 clarity.microsoft.com 创建项目后获取
		// 格式类似: "xxxxxxxxxx"
	},
};

// ============================================================
// 全屏壁纸配置 (fullscreenWallpaperConfig)
// 当 wallpaperMode.defaultMode 设为 "fullscreen" 时生效
// 壁纸会作为整个页面的背景图片显示
// ============================================================
export const fullscreenWallpaperConfig: FullscreenWallpaperConfig = {
	src: {
		desktop: [
			"/assets/desktop-banner/1.webp",
			"/assets/desktop-banner/2.webp",
			"/assets/desktop-banner/3.webp",
			"/assets/desktop-banner/4.webp",
		],
		// 电脑端全屏壁纸图片列表
		// 可以放多张实现自动轮播

		mobile: [
			"/assets/mobile-banner/1.webp",
			"/assets/mobile-banner/2.webp",
			"/assets/mobile-banner/3.webp",
			"/assets/mobile-banner/4.webp",
		],
		// 手机端全屏壁纸图片列表
	},

	// 注：全屏壁纸模式下，这里的图片源会铺满整个页面背景
	// 而 banner 配置中的图片仅在 banner 模式下使用

	position: "center",
	// 壁纸定位方式（CSS object-position）
	// 可选：'top' | 'center' | 'bottom'

	carousel: {
		enable: true,
		// 是否启用壁纸轮播
		// true  = 多张图片自动切换
		// false = 随机显示一张

		interval: 5,
		// 轮播切换间隔（单位：秒）
		// 全屏壁纸建议 5~8 秒，切换太快会显得眼花缭乱
	},

	zIndex: -1,
	// 壁纸的层叠顺序（CSS z-index）
	// -1 确保壁纸在所有内容的下层

	opacity: 0.8,
	// 壁纸透明度
	// 0.0 = 完全透明（不可见）
	// 0.5 = 半透明
	// 1.0 = 完全不透明
	// 建议 0.6~0.9，透明度太低看不清图片，太高影响文字可读性

	blur: 1,
	// 壁纸高斯模糊程度（单位：像素 px）
	// 0   = 不模糊（图片完全清晰）
	// 1-3 = 轻微模糊
	// 5+  = 强烈模糊
	// 轻微模糊可以让文字更清晰可读
};

// ============================================================
// 导航栏配置 (navBarConfig)
// 配置顶部导航菜单的链接结构
// 支持多级下拉菜单
// ============================================================
export const navBarConfig: NavBarConfig = {
	links: [
		// ============================================================
		// 预设链接：LinkPreset.Home（首页）
		// 会自动使用 i18n 中的"首页"文本
		// ============================================================
		LinkPreset.Home,

		// ============================================================
		// 预设链接：LinkPreset.Archive（文章归档）
		// ============================================================
		LinkPreset.Archive,

		// ============================================================
		// 自定义链接（带子菜单）
		// name:       菜单显示名称
		// url:        链接地址
		// icon:       图标（使用 Iconify 图标名）
		// children:   子菜单数组（可选）
		// external:   是否外部链接（可选，true = 在新标签页打开）
		// ============================================================
		
		/*
		{
			name: "Links",
			// 菜单名称（显示在导航栏上的文字）

			url: "/links/",
			// 父菜单点击跳转链接
			// 如果有 children，点击父菜单可能展开子菜单而不是跳转

			icon: "material-symbols:link",
			// 图标名称（使用 Iconify 图标集）
			// 格式: "图标集:图标名"
			// 可以在 https://icones.js.org 搜索图标

			children: [
				{
					name: "GitHub",
					url: "https://github.com/LyraVoid/Mizuki",
					external: true,
					icon: "fa7-brands:github",
				},
				{
					name: "Bilibili",
					url: "https://space.bilibili.com/701864046",
					external: true,
					icon: "fa7-brands:bilibili",
				},
				{
					name: "Gitee",
					url: "https://gitee.com/matsuzakayuki/Mizuki",
					external: true,
					icon: "mdi:git",
				},
			],
		},
		{
			name: "My",
			url: "/content/",
			icon: "material-symbols:person",
			children: [
				{
					name: "Anime",
					url: "/anime/",
					icon: "material-symbols:movie",
				},
				{
					name: "Diary",
					url: "/diary/",
					icon: "material-symbols:book",
				},
				{
					name: "Gallery",
					url: "/albums/",
					icon: "material-symbols:photo-library",
				},
				{
					name: "Devices",
					url: "/devices/",
					icon: "material-symbols:devices",
					external: false,
				},
			],
		},
		*/
		/*
		{
			name: "About",
			url: "/content/",
			icon: "material-symbols:info",
			children: [
				{
					name: "About",
					url: "/about/",
					icon: "material-symbols:person",
				},
				{
					name: "Friends",
					url: "/friends/",
					icon: "material-symbols:group",
				},
			],
		},
		{
			name: "Others",
			url: "#",
			icon: "material-symbols:more-horiz",
			children: [
				{
					name: "Projects",
					url: "/projects/",
					icon: "material-symbols:work",
				},
				{
					name: "Skills",
					url: "/skills/",
					icon: "material-symbols:psychology",
				},
				{
					name: "Timeline",
					url: "/timeline/",
					icon: "material-symbols:timeline",
				},
			],
		},
		*/
	],
};

// ============================================================
// 侧边栏个人信息卡片配置 (profileConfig)
// ============================================================
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/coldgerm.jpg",
	// 头像图片路径
	// - 如果不以 '/' 开头：相对于 src/ 目录（即从项目根目录的 src/ 开始找）
	// - 如果以 '/' 开头：相对于 public/ 目录
	// 示例: "assets/images/avatar.webp" => src/assets/images/avatar.webp
	// 示例: "/images/avatar.webp" => public/images/avatar.webp

	name: "Coldgerm",
	// 你的名字或昵称

	bio: "~你好~",
	// 个人简介/签名

	typewriter: {
		enable: true,
		// 是否启用打字机效果（文字逐字出现）

		speed: 80,
		// 打字速度（毫秒/字）
		// 数值越小越快
	},

	// 社交链接列表（会显示在侧边栏个人信息卡片下方）
	links: [
		{
			name: "Bilibili",
			icon: "fa7-brands:bilibili",
			url: "https://space.bilibili.com/481711062",
		},
		/*
		{
			name: "Gitee",
			icon: "mdi:git",
			url: "https://gitee.com/matsuzakayuki",
		},
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/matsuzaka-yuki",
		},
		{
			name: "Codeberg",
			icon: "simple-icons:codeberg",
			url: "https://codeberg.org",
		},
		{
			name: "Discord",
			icon: "fa7-brands:discord",
			url: "https://discord.gg/MqW6TcQtVM",
		},
		*/
	],
};

// ============================================================
// 版权许可配置 (licenseConfig)
// 控制文章底部显示的版权信息
// ============================================================
export const licenseConfig: LicenseConfig = {
	enable: true,
	// 是否显示版权许可信息

	name: "CC BY-NC-SA 4.0",
	// 版权许可协议名称
	// 常见选择：
	//   "CC BY-NC-SA 4.0" = 署名-非商业性使用-相同方式共享
	//   "CC BY 4.0"       = 仅署名
	//   "MIT"             = MIT 协议
	//   "All Rights Reserved" = 保留所有权利

	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
	// 版权许可协议的详细说明页面 URL
};

// ============================================================
// 固定链接 (Permalink) 配置
// 控制文章的 URL 路径格式，类似 WordPress 的固定链接
// ============================================================
export const permalinkConfig: PermalinkConfig = {
	enable: false,
	// 是否启用全局 permalink 功能
	// true  = 使用下方 format 格式生成文章 URL
	// false = 使用文章文件名（slug）作为 URL

	/**
	 * permalink 格式模板
	 * 你可以自由组合以下占位符来生成个性化的文章链接：
	 *
	 * 时间相关：
	 *   %year%     - 4 位年份，如 2024
	 *   %monthnum% - 2 位月份（补零），01~12
	 *   %day%      - 2 位日期（补零），01~31
	 *   %hour%     - 2 位小时（24小时制），00~23
	 *   %minute%   - 2 位分钟，00~59
	 *   %second%   - 2 位秒数，00~59
	 *
	 * 文章相关：
	 *   %post_id%   - 文章序号（按发布时间升序排列，最早的为 1）
	 *   %postname%  - 文章文件名（slug，全小写）
	 *   %raw_postname% - 文章原始文件名（保留原始大小写）
	 *   %category%  - 文章分类名（无分类时为 "uncategorized"）
	 *
	 * 组合示例：
	 *   "%year%-%monthnum%-%postname%"
	 *     → /2024-12-my-article/
	 *
	 *   "%post_id%-%postname%"
	 *     → /42-my-article/
	 *
	 *   "%category%-%postname%"
	 *     → /tech-my-article/
	 *
	 *   "%year%/%monthnum%/%day%/%postname%"
	 *     → /2024/12/01/my-article/
	 *
	 * 注意：使用 "/" 可以构建多级路径
	 */
	format: "%postname%",
	// permalink 格式模板字符串
	// 默认只使用文件名（slug），效果和 enable: false 类似
};

// ============================================================
// 代码块高亮主题配置 (expressiveCodeConfig)
// 基于 astro-expressive-code 插件
// ============================================================
export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
	// 代码块高亮主题
	// ⚠️ 此博客主题目前仅支持深色背景，请选择深色主题
	// 可选值："github-dark" | "one-dark-pro" | "dracula" | "monokai" | 等
	// 更多主题请查看 expressive-code 文档

	hideDuringThemeTransition: true,
	// 在主题切换（如深色/浅色模式切换）时是否隐藏代码块
	// 防止切换过程中出现闪烁或卡顿
	// 建议保持 true
};

// ============================================================
// 评论系统配置 (commentConfig)
// 支持 Twikoo 和 Giscus 两种评论系统
// ============================================================
export const commentConfig: CommentConfig = {
	enable: false,
	// 评论功能总开关
	// false = 完全禁用评论，文章页不显示评论区域

	system: "twikoo",
	// 选择评论系统：
	//   "twikoo" = 使用 Twikoo（腾讯云/自部署的评论系统）
	//   "giscus" = 使用 Giscus（基于 GitHub Discussions）

	twikoo: {
		// Twikoo 配置（当 system 设为 "twikoo" 时生效）
		envId: "https://twikoo.vercel.app",
		// Twikoo 环境 ID
		// 可以是部署 URL 或云函数环境 ID
		// 需要自行部署 Twikoo 后端

		lang: SITE_LANG,
		// Twikoo UI 语言
	},

	giscus: {
		// Giscus 配置（当 system 设为 "giscus" 时生效）
		repo: "your-github-username/your-repo-name",
		// GitHub 仓库名，格式："用户名/仓库名"
		// 评论数据将存储在该仓库的 Discussions 中

		repoId: "your-repo-id",
		// GitHub 仓库 ID（不是仓库名！）
		// 需要通过 GitHub GraphQL API 查询获取

		category: "Announcements",
		// GitHub Discussions 分类名称
		// 需要在仓库 Settings → Discussions 中创建

		categoryId: "your-category-id",
		// GitHub Discussions 分类 ID
		// 同样需要通过 GitHub API 获取

		mapping: "pathname",
		// 文章与 Discussion 的映射方式
		// 可选：pathname | url | title | og:title
		// 建议用 pathname（每个 URL 路径对应一个 Discussion）

		strict: "0",
		// 严格模式
		// "0" = 非严格（映射页面不存在时自动创建）

		reactionsEnabled: "1",
		// 是否启用表情反应（点赞等）
		// "1" = 启用

		emitMetadata: "0",
		// 是否发送元数据

		inputPosition: "top",
		// 评论输入框位置
		// "top"  = 顶部（先显示输入框，再显示评论列表）
		// "bottom" = 底部

		theme: "preferred_color_scheme",
		// 评论框主题
		// "preferred_color_scheme" = 跟随系统主题

		lang: SITE_LANG,
		// Giscus 显示语言

		loading: "lazy",
		// 加载方式
		// "lazy" = 懒加载（滚动到评论区时才加载）
	},
};

// ============================================================
// 分享功能配置 (shareConfig)
// ============================================================
export const shareConfig: ShareConfig = {
	enable: true,
	// 是否在文章底部显示分享按钮
	// 开启后用户可以将文章分享到社交媒体
};

// ============================================================
// 公告栏配置 (announcementConfig)
// ============================================================
export const announcementConfig: AnnouncementConfig = {
	title: "",
	// 公告标题
	// 留空则使用国际化字符串中的默认标题（key: announcement）

	content: "还在建还在建UvU",
	// 公告正文内容
	// 可以写 HTML 格式的内容

	closable: true,
	// 是否允许用户关闭公告
	// true  = 显示关闭按钮，用户可手动关闭
	// false = 强制显示，无法关闭

	link: {
		enable: true,
		// 是否显示公告底部的"了解更多"链接

		text: "Learn More",
		// 链接文字

		url: "/about/",
		// 链接跳转地址

		external: false,
		// 是否为外部链接
		// true  = 新标签页打开
		// false = 站内跳转
	},
};

// ============================================================
// 音乐播放器配置 (musicPlayerConfig)
// ============================================================
export const musicPlayerConfig: MusicPlayerConfig = {
	enable: false,
	// 音乐播放器总开关
	// false = 完全禁用音乐播放器

	showFloatingPlayer: true,
	// 是否显示悬浮播放器 UI
	// 开启后在页面右下角会有一个小播放器

	floatingEntryMode: "fab",
	// 悬浮播放器入口模式：
	//   "default" = 独立的悬浮播放器控件
	//   "fab"     = 集成到页面右下角的通用 FAB（浮动操作按钮）组中

	mode: "local",
	// 音乐播放器工作模式：
	//   "local" = 本地模式（播放本地 MP3 文件）
	//   "meting" = Meting API 模式（在线获取歌单）

	meting_api:
		"https://meting.mysqil.com/api?server=:server&type=:type&id=:id&auth=:auth&r=:r",
	// Meting API 地址（仅 mode 为 "meting" 时使用）
	// 这是一个将网易云/QQ音乐等平台的歌单转为通用 API 的服务
	// 需要自行搭建或找公开的 Meting 服务
	// 占位符 :server、:type、:id 会被自动替换

	id: "14164869977",
	// 歌单/专辑/歌曲的 ID
	// local 模式：对应 src/data/ 中的数据
	// meting 模式：对应音乐平台的歌单 ID

	server: "netease",
	// 音乐源服务器（仅 meting 模式）
	// netease  = 网易云音乐
	// tencent  = QQ音乐
	// kugou    = 酷狗音乐
	// xiami    = 虾米音乐
	// baidu    = 百度音乐

	type: "playlist",
	// 播单类型（仅 meting 模式）
	// playlist = 歌单
	// album    = 专辑
	// artist   = 歌手
	// song     = 单曲
};

// ============================================================
// 页脚自定义 HTML 配置 (footerConfig)
// ============================================================
export const footerConfig: FooterConfig = {
	enable: false,
	// 是否启用页脚自定义 HTML 注入功能
	// 用于在页脚添加备案号、版权声明等信息

	customHtml: "",
	// 自定义 HTML 内容
	// 例如中国大陆网站的 ICP 备案号：
	// '鄂ICP备XXXXXXXX号-1'
	//
	// 注意：如果此字段留空，则会自动读取 FooterConfig.html 文件内容
	// 如果此字段不为空，则优先使用此字段
	// FooterConfig.html 可能会在未来的某个版本弃用
};

// ============================================================
// 侧边栏布局配置 (sidebarLayoutConfig)
// 这是侧边栏最核心的配置
// 控制：
//   1. 每个组件的显示/隐藏
//   2. 组件的排列顺序
//   3. 组件的定位方式（固定顶部/随滚动）
//   4. 组件的响应式行为
//   5. 动画效果
//
// sidebar: 控制组件所在的侧边栏（left 或 right）
// 注意：移动端通常不显示右侧栏内容
// 若组件设置在 right，请确保 layout.position 为 "both"（左右都有）
// ============================================================
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	// 侧边栏组件属性配置列表
	// 数组顺序决定了**配置定义**的顺序，不决定实际显示顺序
	// 实际显示顺序由下方 components 数组控制
	properties: [
		{
			type: "profile",
			// 组件类型：用户资料卡片

			position: "top",
			// 定位方式：
			//   "top"    = 固定在顶部，不随页面滚动
			//   "sticky" = 粘性定位，随页面滚动，但保持在可视区域内
			//   "none"   = 跟随正常文档流

			class: "onload-animation",
			// CSS 类名，用于应用样式和动画
			// "onload-animation" 是内置的加载动画类

			animationDelay: 0,
			// 动画延迟时间（单位：毫秒）
			// 用于错开多个组件的动画效果
			// 0 = 立即显示
		},
		{
			type: "announcement",
			position: "top",
			class: "onload-animation",
			animationDelay: 50,
		},
		{
			type: "music-sidebar",
			position: "sticky",
			class: "onload-animation",
			animationDelay: 100,
		},
		{
			type: "categories",
			position: "sticky",
			class: "onload-animation",
			animationDelay: 150,
			responsive: {
				collapseThreshold: 5,
				// 折叠阈值：当分类数量超过 5 个时，自动折叠为"展开"模式
				// 避免分类太多占满侧边栏
			},
		},
		{
			type: "tags",
			position: "top",
			class: "onload-animation",
			animationDelay: 250,
			responsive: {
				collapseThreshold: 20,
				// 标签数量超过 20 个时自动折叠
			},
		},
		{
			type: "card-toc",
			position: "sticky",
			class: "onload-animation",
			animationDelay: 200,
		},
		{
			type: "site-stats",
			position: "top",
			class: "onload-animation",
			animationDelay: 200,
		},
		{
			type: "calendar",
			position: "top",
			class: "onload-animation",
			animationDelay: 250,
		},
	],

	// ============================================================
	// 组件实际布局配置
	// 决定哪个组件在哪个侧边栏显示，以及显示的先后顺序
	// ============================================================
	components: {
		left: ["profile", "announcement", "tags", "card-toc"],
		// 左侧边栏显示的组件列表（按数组顺序从上到下排列）

		right: ["site-stats", "calendar", "categories", "music-sidebar"],
		// 右侧边栏显示的组件列表

		drawer: [
			"profile",
			"announcement",
			"music-sidebar",
			"categories",
			"tags",
		],
		// 移动端抽屉菜单中显示的组件列表
		// 移动端屏幕窄，侧边栏会折叠成抽屉/菜单形式
	},

	// ============================================================
	// 默认动画配置
	// ============================================================
	defaultAnimation: {
		enable: true,
		// 是否启用侧边栏组件的入场动画

		baseDelay: 0,
		// 基础延迟时间（毫秒）
		// 所有组件都从这个时间开始计算延迟

		increment: 50,
		// 递增延迟时间（毫秒）
		// 第一个组件延迟 baseDelay，第二个延迟 baseDelay + increment，以此类推
		// 这样组件会依次出现，产生错落有致的动画效果
	},

	// ============================================================
	// 响应式断点配置
	// ============================================================
	responsive: {
		breakpoints: {
			mobile: 768,
			// 移动端断点：屏幕宽度 < 768px 时视为移动端
			// 此时会隐藏右侧边栏，使用 drawer 显示组件

			tablet: 1280,
			// 平板端断点：768px ≤ 屏幕宽度 < 1280px
			// 此时可能显示单侧边栏

			desktop: 1280,
			// 桌面端断点：屏幕宽度 ≥ 1280px
			// 完整显示左右两侧边栏
		},
	},
};

// ============================================================
// 樱花飘落特效配置 (sakuraConfig)
// 在页面背景飘落樱花花瓣的粒子效果
// ============================================================
export const sakuraConfig: SakuraConfig = {
	enable: false,
	// 是否启用樱花特效
	// 默认关闭，因为粒子效果对性能有影响

	sakuraNum: 21,
	// 同时飘落的樱花花瓣数量
	// 数量越多越华丽，但性能消耗也越大
	// 建议 10~30

	limitTimes: -1,
	// 每片花瓣的越界次数限制
	// -1 = 无限循环（花瓣飘出屏幕后会重新出现）
	// 其他数值表示飘出屏幕 N 次后停止

	size: {
		min: 0.5,
		// 花瓣最小尺寸倍数（相对于原始大小）

		max: 1.1,
		// 花瓣最大尺寸倍数
		// 每片花瓣在这个范围内随机取一个尺寸
	},

	opacity: {
		min: 0.3,
		// 花瓣最小透明度（0.0 ~ 1.0）

		max: 0.9,
		// 花瓣最大透明度
	},

	speed: {
		horizontal: {
			min: -1.7,
			// 水平移动最小速度（负数表示向左飘）
			max: -1.2,
			// 水平移动最大速度
		},
		vertical: {
			min: 1.5,
			// 垂直下落最小速度
			max: 2.2,
			// 垂直下落最大速度
		},
		rotation: 0.03,
		// 花瓣旋转速度（弧度/帧）

		fadeSpeed: 0.03,
		// 花瓣消失速度
		// ⚠️ 不应大于最小不透明度（opacity.min），否则可能看不到花瓣
	},

	zIndex: 100,
	// 花瓣的层叠顺序（CSS z-index）
	// 确保樱花在合适层级显示，不被其他元素遮挡
};

// ============================================================
// Pio 看板娘配置 (pioConfig)
// 在页面角落显示一个 Live2D 看板娘（可交互的虚拟角色）
// ============================================================
export const pioConfig: import("./types/config").PioConfig = {
	enable: false,
	// 是否启用看板娘
	// 默认关闭以提升性能

	models: ["/pio/models/pio/model.json"],
	// Live2D 模型文件路径数组
	// 可以配置多个模型供用户切换
	// 路径相对于 /public 目录

	position: "left",
	// 看板娘在屏幕上的位置
	// "left"  = 左下角
	// "right" = 右下角

	width: 280,
	// 看板娘显示宽度（像素）

	height: 250,
	// 看板娘显示高度（像素）

	mode: "draggable",
	// 交互模式：
	// "draggable" = 可拖拽（用户可以用鼠标拖动看板娘到任意位置）

	hiddenOnMobile: true,
	// 移动端是否隐藏
	// true = 手机端不显示看板娘（屏幕太小）

	dialog: {
		welcome: "Welcome to Mizuki Website!",
		// 页面加载时的欢迎语

		touch: [
			"What are you doing?",
			"Stop touching me!",
			"HENTAI!",
			"Don't bully me like that!",
		],
		// 点击/触摸看板娘时的随机回复语
		// 会从数组中随机选取一条显示

		home: "Click here to go back to homepage!",
		// 点击"回首页"按钮时的提示语

		skin: ["Want to see my new outfit?", "The new outfit looks great~"],
		// 换装时的提示语

		close: "QWQ See you next time~",
		// 关闭看板娘时的告别语

		link: "https://github.com/LyraVoid/Mizuki",
		// 看板娘"关于"按钮的跳转链接
	},
};

// ============================================================
// 相关文章推荐配置 (relatedPostsConfig)
// 在文章底部显示与当前文章相关的其他文章
// ============================================================
export const relatedPostsConfig: RelatedPostsConfig = {
	enable: true,
	// 是否显示"相关文章"推荐

	maxCount: 5,
	// 最多显示的相关文章数量
};

// ============================================================
// 随机文章推荐配置 (randomPostsConfig)
// 在文章底部或侧边栏显示随机文章
// ============================================================
export const randomPostsConfig: RandomPostsConfig = {
	enable: true,
	// 是否显示"随机文章"推荐

	maxCount: 5,
	// 最多显示的随机文章数量
};

// ============================================================
// 统一导出所有功能模块的配置
// 方便其他组件通过一个入口访问所有配置
// ============================================================
export const widgetConfigs = {
	profile: profileConfig,
	announcement: announcementConfig,
	music: musicPlayerConfig,
	layout: sidebarLayoutConfig,
	sakura: sakuraConfig,
	fullscreenWallpaper: fullscreenWallpaperConfig,
	pio: pioConfig,
	share: shareConfig,
	relatedPosts: relatedPostsConfig,
	randomPosts: randomPostsConfig,
} as const;

// umamiConfig 相关配置已移动至 astro.config.mjs 中
// 统计脚本请自行在 Layout.astro 文件的 <head> 中插入
