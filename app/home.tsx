import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowUpRight, Zap, Target, MessageSquare, BookOpen, FileText } from "lucide-react";
import { listPages } from "@/lib/pages";
import SideNav from "./nav";

export type Lang = "zh" | "en";

// 头像：public/avatar.jpg / .png / .webp，没有就用字母头像
const AVATAR = ["avatar.jpg", "avatar.png", "avatar.webp"].find((f) =>
  fs.existsSync(path.join(process.cwd(), "public", f)),
);

const SLOGAN = "Building small, useful things.";

const T = {
  zh: {
    badge: "Indie Hacker · 独立开发",
    intro: "Java 工程师，业余做点小工具。从想法到上线，一个人做完。",
    about: "简介",
    built: "个人作品",
    work: "项目经历",
    tech: "常用技术",
    live: "上线",
    switchLabel: "EN",
    switchHref: "/en",
  },
  en: {
    badge: "Indie Hacker",
    intro: "Java engineer. I build small tools on the side, from idea to launch.",
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

const SKILLS = ["Java", "Spring Boot", "MySQL", "Redis", "RocketMQ", "Next.js / React", "TypeScript", "PostgreSQL", "Vercel"];

function Avatar({ size }: { size: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-20 h-20 text-2xl" : "w-9 h-9 text-sm";
  return AVATAR ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/${AVATAR}`} alt="Michael"
      className={`${cls} rounded-full object-cover ring-1 ring-zinc-700 ring-offset-4 ring-offset-[#08090a]`} />
  ) : (
    <span className={`${cls} rounded-full grid place-items-center bg-gradient-to-br from-emerald-400/30 to-zinc-800 ring-1 ring-zinc-700 font-bold`}>M</span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400/90">{children}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
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
    ...(pages.length > 0 ? [{ id: "work", label: t.work, children: pages }] : []),
    { id: "tech", label: t.tech },
  ];
  const external = [
    { label: "GitHub", href: "https://github.com/opc-x" },
    ...(lang === "en" ? [{ label: "X", href: "https://x.com/Michaelcjfw" }] : []),
  ];

  return (
    <div className="backdrop min-h-screen lg:flex">

      {/* 语言切换：大屏固定右上角 */}
      <Link href={t.switchHref}
        className="hidden lg:inline-flex fixed z-50 right-8 top-6 px-3 py-1 rounded-full border border-zinc-800 bg-black/40 backdrop-blur font-mono text-xs text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors">
        {t.switchLabel}
      </Link>

      {/* 左侧栏：大屏 */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-72 shrink-0 flex-col px-10 py-16 border-r border-zinc-900/80">
        <a href="#about" className="flex flex-col gap-5">
          <Avatar size="lg" />
          <span>
            <span className="block text-2xl font-semibold tracking-tight text-zinc-50">Michael</span>
            <span className="mt-1 block font-mono text-xs text-zinc-500">{SLOGAN}</span>
          </span>
        </a>
        <div className="mt-14">
          <SideNav items={nav} />
        </div>
        <div className="mt-auto flex gap-5 text-sm">
          {external.map((e) => (
            <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-100 transition-colors">
              {e.label}
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </aside>

      {/* 顶栏：小屏 */}
      <header className="lg:hidden sticky top-0 z-40 border-b border-zinc-900 bg-[#08090a]/85 backdrop-blur pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center gap-3 pl-4 pr-4 py-2.5">
          <Avatar size="sm" />
          <nav className="flex-1 min-w-0 flex items-center gap-5 overflow-x-auto whitespace-nowrap text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="text-zinc-400 hover:text-zinc-100 transition-colors">{n.label}</a>
            ))}
          </nav>
          <Link href={t.switchHref}
            className="shrink-0 px-2.5 py-1 rounded-full border border-zinc-800 font-mono text-xs text-zinc-300">
            {t.switchLabel}
          </Link>
        </div>
      </header>

      <main className="flex-1 min-w-0">
        <div className="max-w-3xl mx-auto px-5 sm:px-10 pt-16 sm:pt-28 pb-20 space-y-24 sm:space-y-32">

          {/* 简介 */}
          <section id="about" className="scroll-mt-24 space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-black/30 font-mono text-[11px] tracking-wide text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t.badge}
            </div>
            <h1 className="text-5xl sm:text-7xl font-semibold tracking-tighter leading-[1.02]">
              <span className="bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Building small,
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                useful things.
              </span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-xl">{t.intro}</p>
            <div className="flex flex-wrap gap-5 text-sm lg:hidden">
              {external.map((e) => (
                <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-100 transition-colors">
                  {e.label} <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </section>

          {/* 个人作品 */}
          <section id="built" className="scroll-mt-24 space-y-8">
            <SectionTitle>{t.built}</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              {PRODUCTS.map((p) => {
                const Icon = p.icon;
                const isWip = p.status === "wip";
                const name = typeof p.name === "string" ? p.name : p.name[lang];
                return (
                  <a key={name} href={p.url}
                    target={isWip ? undefined : "_blank"} rel="noopener noreferrer"
                    className={`group relative flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                      isWip
                        ? "border-dashed border-zinc-800 cursor-default"
                        : "border-zinc-800/80 bg-zinc-900/40 hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900/80 hover:shadow-[0_20px_40px_-20px_rgba(52,211,153,0.25)]"
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className={`p-2 rounded-lg ${isWip ? "bg-zinc-900 text-zinc-600" : "bg-zinc-800/80 text-zinc-300 group-hover:text-emerald-300 transition-colors"}`}>
                        <Icon size={18} />
                      </span>
                      {isWip ? (
                        <span className="font-mono text-[11px] text-zinc-600">{p.tag[lang]}</span>
                      ) : (
                        <ArrowUpRight size={18} className="text-zinc-600 transition-all group-hover:text-zinc-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-lg font-semibold tracking-tight ${isWip ? "text-zinc-600" : "text-zinc-100"}`}>{name}</span>
                        {!isWip && (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{t.live}
                          </span>
                        )}
                      </div>
                      {!isWip && <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{p.tag[lang]}</div>}
                      <p className={`text-sm leading-relaxed ${isWip ? "text-zinc-700" : "text-zinc-400"}`}>{p.desc[lang]}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          {/* 项目经历：public/pages/*.html，放进去就自动出现 */}
          {pages.length > 0 && (
            <section id="work" className="scroll-mt-24 space-y-8">
              <SectionTitle>{t.work}</SectionTitle>
              <div className="divide-y divide-zinc-800/80 border-y border-zinc-800/80">
                {pages.map((pg) => (
                  <a key={pg.href} href={pg.href}
                    className="group flex items-center gap-4 py-5 transition-colors">
                    <FileText size={18} className="shrink-0 text-zinc-600 group-hover:text-emerald-300 transition-colors" />
                    <span className="flex-1 text-lg text-zinc-200 group-hover:text-white transition-colors">{pg.title}</span>
                    <ArrowUpRight size={18} className="text-zinc-600 transition-all group-hover:text-zinc-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* 常用技术 */}
          <section id="tech" className="scroll-mt-24 space-y-8">
            <SectionTitle>{t.tech}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/40 font-mono text-xs text-zinc-300">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <footer className="pt-8 border-t border-zinc-900 flex items-center justify-between font-mono text-xs text-zinc-600">
            <span>© 2026 Michael</span>
            <span>{SLOGAN}</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
