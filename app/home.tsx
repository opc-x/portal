import Link from "next/link";
import { ExternalLink, Zap, Target, MessageSquare, BookOpen, FileText } from "lucide-react";
import { listPages } from "@/lib/pages";

export type Lang = "zh" | "en";

const T = {
  zh: {
    badge: "Indie Hacker · 独立开发",
    line1: "Java 工程师，业余做点小工具。",
    line2: "做有用的小东西，从想法到上线。",
    built: "做过的东西",
    writing: "写的东西",
    tech: "常用技术",
    live: "上线",
    switchLabel: "English",
    switchHref: "/en",
  },
  en: {
    badge: "Indie Hacker",
    line1: "Java engineer. Building small, useful tools on the side.",
    line2: "From idea to launch.",
    built: "Things I've built",
    writing: "Writing",
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

export default function Home({ lang }: { lang: Lang }) {
  const t = T[lang];
  const pages = listPages(lang);
  const skills = [...SKILLS, lang === "zh" ? "AI 集成" : "AI integration"];
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-20 space-y-24">

      {/* Hero */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t.badge}
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          Michael
        </h1>
        <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
          {t.line1}<br />
          {t.line2}
        </p>
        <div className="flex gap-4 text-sm">
          <a href="https://github.com/opc-x" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors">
            GitHub <ExternalLink size={12} />
          </a>
          {lang === "en" && (
            <a href="https://x.com/Michaelcjfw" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors">
              X <ExternalLink size={12} />
            </a>
          )}
          <Link href={t.switchHref}
            className="ml-auto text-zinc-500 hover:text-zinc-100 transition-colors">
            {t.switchLabel}
          </Link>
        </div>
      </section>

      {/* Products */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">{t.built}</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
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
                className={`group flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 ${
                  isWip
                    ? "border-zinc-800 bg-zinc-900/30 cursor-default"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900"
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-lg ${isWip ? "bg-zinc-800 text-zinc-600" : "bg-zinc-800 text-zinc-300 group-hover:text-white transition-colors"}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isWip ? "text-zinc-600" : "text-zinc-100"}`}>{name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      isWip ? "bg-zinc-800 text-zinc-600" : "bg-zinc-800 text-zinc-400"
                    }`}>{p.tag[lang]}</span>
                    {!isWip && (
                      <span className="ml-auto flex items-center gap-1 text-xs text-emerald-500">
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

      {/* Writing: public/pages/*.html，放进去就自动出现 */}
      {pages.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">{t.writing}</h2>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <div className="grid gap-2">
            {pages.map((pg) => (
              <a key={pg.href} href={pg.href}
                className="group flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900 transition-all">
                <FileText size={16} className="text-zinc-500 group-hover:text-zinc-200 transition-colors" />
                <span className="text-zinc-200">{pg.title}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">{t.tech}</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-zinc-800 text-xs text-zinc-600 flex items-center justify-between">
        <span>© 2026 Michael</span>
      </footer>

    </main>
  );
}
