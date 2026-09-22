import Link from "next/link";
import { ExternalLink, Zap, Target, MessageSquare, BookOpen, FileText } from "lucide-react";
import fs from "fs";
import path from "path";
import { listPages } from "@/lib/pages";

// 头像：放一张 public/avatar.jpg（或 .png / .webp）就会替换掉字母头像
const AVATAR = ["avatar.jpg", "avatar.png", "avatar.webp"].find((f) =>
  fs.existsSync(path.join(process.cwd(), "public", f)),
);

export type Lang = "zh" | "en";

const T = {
  zh: {
    badge: "Indie Hacker · 独立开发",
    line1: "Java 工程师，业余做点小工具。",
    line2: "做有用的小东西，从想法到上线。",
    slogan: "做有用的小东西",
    about: "简介",
    built: "个人作品",
    work: "项目经历",
    tech: "常用技术",
    live: "上线",
    switchLabel: "English",
    switchHref: "/en",
  },
  en: {
    badge: "Indie Hacker",
    line1: "Java engineer. Building small, useful tools on the side.",
    line2: "From idea to launch.",
    slogan: "Building small, useful things",
    about: "About",
    built: "Side projects",
    work: "Work",
    tech: "Tech I use",
    live: "Live",
    switchLabel: "中文",
    switchHref: "/",
  },
};

const PRODUCTS = [
  {
    name: "JobSniper",
    tag: { zh: "求职工具", en: "Job hunting" },
    desc: {
      zh: "精准狙击目标职位 — 渠道打通 · 职位画像 · 匹配评分",
      en: "Find the right roles — multi-channel sourcing, job profiles, match scoring",
    },
    url: "https://jobsniper.opc-x.org",
    icon: Target,
    status: "live",
  },
  {
    name: "TalkFlow",
    tag: { zh: "AI 对话", en: "AI chat" },
    desc: {
      zh: "流式 AI 对话平台，场景化提示词 · 多模型切换 · 实时协作",
      en: "Streaming AI chat with scenario prompts, model switching and real-time collaboration",
    },
    url: "https://talkflow-peters-projects-48a2541f.vercel.app",
    icon: MessageSquare,
    status: "live",
  },
  {
    name: "Ogden 850",
    tag: { zh: "英语学习", en: "English learning" },
    desc: {
      zh: "基于 Ogden 基础英语 850 词核心词汇的学习与练习工具",
      en: "Learn and practice English with Ogden's 850-word Basic English vocabulary",
    },
    url: "https://ogden850app.vercel.app",
    icon: BookOpen,
    status: "live",
  },
  {
    name: { zh: "下一个", en: "Next" },
    tag: { zh: "在做", en: "WIP" },
    desc: { zh: "还在做，做好了放上来", en: "In progress — it will show up here when it's ready" },
    url: "#",
    icon: Zap,
    status: "wip",
  },
];

const SKILLS = [
  "Next.js / React", "TypeScript", "Tailwind CSS",
  "PostgreSQL / Neon", "Vercel",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">{children}</h2>
      <div className="flex-1 h-px bg-zinc-800" />
    </div>
  );
}

export default function Home({ lang }: { lang: Lang }) {
  const t = T[lang];
  const pages = listPages(lang);
  const skills = [...SKILLS, lang === "zh" ? "AI 集成" : "AI integration"];

  const nav = [
    { id: "about", label: t.about },
    { id: "built", label: t.built },
    ...(pages.length > 0 ? [{ id: "work", label: t.work }] : []),
    { id: "tech", label: t.tech },
  ];
  const external = [
    { label: "GitHub", href: "https://github.com/opc-x" },
    ...(lang === "en" ? [{ label: "X", href: "https://x.com/Michaelcjfw" }] : []),
  ];
  const navLink = "text-zinc-400 hover:text-zinc-100 transition-colors";

  return (
    <div className="min-h-screen lg:flex">

      {/* 语言切换：大屏固定在右上角，小屏放在顶部导航右侧 */}
      <Link href={t.switchHref}
        className="hidden lg:block fixed z-50 right-6 top-[calc(env(safe-area-inset-top,0px)+0.75rem)] px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur text-xs text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors">
        {t.switchLabel}
      </Link>

      {/* 左侧导航：大屏显示 */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-60 shrink-0 flex-col gap-10 border-r border-zinc-900 px-8 py-20">
        <a href="#about" className="flex flex-col gap-4">
          {AVATAR ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/${AVATAR}`} alt="Michael" className="w-16 h-16 rounded-full object-cover border border-zinc-800" />
          ) : (
            <span className="w-16 h-16 rounded-full grid place-items-center bg-gradient-to-br from-emerald-400/25 to-zinc-800 border border-zinc-700 text-2xl font-bold text-zinc-100">M</span>
          )}
          <span className="space-y-1">
            <span className="block text-lg font-bold tracking-tight text-zinc-100">Michael</span>
            <span className="block text-xs text-zinc-500">{t.slogan}</span>
          </span>
        </a>
        <nav className="flex flex-col gap-3 text-sm">
          {nav.map((n) => (
            <div key={n.id} className="flex flex-col gap-3">
              <a href={`#${n.id}`} className={navLink}>{n.label}</a>
              {n.id === "work" && pages.map((pg) => (
                <a key={pg.href} href={pg.href} className={`${navLink} pl-3 border-l border-zinc-800`}>{pg.title}</a>
              ))}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3 text-sm">
          {external.map((e) => (
            <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-1.5 ${navLink}`}>
              {e.label} <ExternalLink size={12} />
            </a>
          ))}
        </div>
      </aside>

      {/* 顶部导航：小屏显示，横向滑动 */}
      <header className="lg:hidden sticky top-0 z-40 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center gap-3 pr-4">
          <nav className="flex-1 min-w-0 flex items-center gap-5 overflow-x-auto whitespace-nowrap px-5 py-3 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <a href="#about" className="font-bold text-zinc-100">Michael</a>
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={navLink}>{n.label}</a>
            ))}
          </nav>
          <Link href={t.switchHref}
            className="shrink-0 px-3 py-1 rounded-full border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors">
            {t.switchLabel}
          </Link>
        </div>
      </header>

      <main className="flex-1 min-w-0">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-20 sm:space-y-24">

          {/* 简介 */}
          <section id="about" className="scroll-mt-20 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 text-xs text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Michael</h1>
            <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-xl">
              {t.line1}<br />
              {t.line2}
            </p>
            <div className="flex flex-wrap gap-4 text-sm lg:hidden">
              {external.map((e) => (
                <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 ${navLink}`}>
                  {e.label} <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </section>

          {/* 做过的东西 */}
          <section id="built" className="scroll-mt-20 space-y-6">
            <SectionTitle>{t.built}</SectionTitle>
            <div className="grid gap-4">
              {PRODUCTS.map((p) => {
                const Icon = p.icon;
                const isWip = p.status === "wip";
                const name = typeof p.name === "string" ? p.name : p.name[lang];
                return (
                  <a
                    key={name}
                    href={p.url}
                    target={isWip ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className={`group flex items-start gap-4 p-4 sm:p-5 rounded-xl border transition-all duration-200 ${
                      isWip
                        ? "border-zinc-800 bg-zinc-900/30 cursor-default"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900"
                    }`}
                  >
                    <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${isWip ? "bg-zinc-800 text-zinc-600" : "bg-zinc-800 text-zinc-300 group-hover:text-white transition-colors"}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className={`font-semibold ${isWip ? "text-zinc-600" : "text-zinc-100"}`}>{name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                          isWip ? "bg-zinc-800 text-zinc-600" : "bg-zinc-800 text-zinc-400"
                        }`}>{p.tag[lang]}</span>
                        {!isWip && (
                          <span className="ml-auto flex items-center gap-1 text-xs text-emerald-500 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {t.live}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed ${isWip ? "text-zinc-700" : "text-zinc-400"}`}>{p.desc[lang]}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          {/* 项目经历：public/pages/*.html，放进去就自动出现 */}
          {pages.length > 0 && (
            <section id="work" className="scroll-mt-20 space-y-6">
              <SectionTitle>{t.work}</SectionTitle>
              <div className="grid gap-2">
                {pages.map((pg) => (
                  <a key={pg.href} href={pg.href}
                    className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900 transition-all">
                    <FileText size={16} className="shrink-0 text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                    <span className="text-zinc-200">{pg.title}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* 常用技术 */}
          <section id="tech" className="scroll-mt-20 space-y-6">
            <SectionTitle>{t.tech}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <footer className="pt-8 border-t border-zinc-800 text-xs text-zinc-600">
            <span>© 2026 Michael</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
