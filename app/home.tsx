import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowUpRight, Target, MessageSquare, BookOpen, FileText } from "lucide-react";
import { listPages, type PageEntry } from "@/lib/pages";
import SideNav, { MobileNav } from "./nav";

export type Lang = "zh" | "en";

// 头像：public/avatar.jpg / .png / .webp，没有就用字母头像
const AVATAR = ["avatar.jpg", "avatar.png", "avatar.webp"].find((f) =>
  fs.existsSync(path.join(process.cwd(), "public", f)),
);



// 中文只留最小剂量：只有中文版简介一句是中文，其余两版共用英文
const T = {
  zh: {
    intro: "资深 Java 后端，深耕支付与钱包。也独立做产品，从想法到上线一个人完成。",
    workNote: "",
    switchLabel: "EN",
    switchHref: "/en",
  },
  en: {
    intro: "Senior Java backend engineer, specialized in payments and wallets. I also build and ship my own products, end to end.",
    workNote: "in Chinese",
    switchLabel: "中文",
    switchHref: "/",
  },
};
const UI = {
  badge: "Open to freelance work",
  role: "Senior Java backend engineer",
  about: "about",
  built: "projects",
  work: "work",
  tech: "stack",
  live: "Live",
};

// 子页标题是中文，首页上统一显示英文
const TITLE_EN: Record<string, string> = {
  "支付系统": "Payout system",
  "自持钱包": "Self-custody wallet",
  "转账": "Transfers",
  "兑换": "Swap",
  "DApp 入口": "DApp access",
};
const enTitle = (t: string) => t.split(" · ").map((x) => TITLE_EN[x.trim()] ?? x).join(" · ");
const toEn = (list: PageEntry[]): PageEntry[] =>
  list.map((e) => ({ ...e, title: enTitle(e.title), children: e.children?.map((c) => ({ ...c, title: enTitle(c.title) })) }));

const PRODUCTS = [
  {
    name: "JobSniper",
    tag: "Job search",
    desc: "Pulls roles from multiple job boards, profiles each one and scores how well you match.",
    url: "https://jobsniper.opc-x.org",
    icon: Target,
    status: "live",
  },
  {
    name: "TalkFlow",
    tag: "AI chat",
    desc: "Streaming AI chat with ready-made scenario prompts, model switching and live collaboration.",
    url: "https://talkflow-peters-projects-48a2541f.vercel.app",
    icon: MessageSquare,
    status: "live",
  },
  {
    name: "Ogden 850",
    tag: "English learning",
    desc: "Learn and practice the 850 core words of Ogden's Basic English.",
    url: "https://ogden850app.vercel.app",
    icon: BookOpen,
    status: "live",
  },
];

const SKILLS = ["Java", "Spring Boot", "MySQL", "Redis", "Kafka", "PostgreSQL", "TypeScript", "Next.js / React", "Vercel", "LLM APIs"];

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
      <h2 className="font-display text-sm text-zinc-300"><span className="text-emerald-400">{"// "}</span>{children}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-zinc-700 to-transparent" />
    </div>
  );
}

export default function Home({ lang }: { lang: Lang }) {
  const t = T[lang];
  // 英文子页没写就用中文子页，标题翻成英文
  const enPages = listPages("en");
  const pages = toEn(enPages.length > 0 ? enPages : listPages("zh"));
  const skills = SKILLS;

  const nav = [
    { id: "about", label: UI.about },
    { id: "built", label: UI.built },
    ...(pages.length > 0 ? [{ id: "work", label: UI.work, children: pages }] : []),
    { id: "tech", label: UI.tech },
  ];
  const external = [
    { label: "Email", href: "mailto:jcui1@my.hpu.edu" },
    { label: "GitHub", href: "https://github.com/opc-x" },
    { label: "X", href: "https://x.com/Michaelcjfw" },
  ];

  return (
    <div lang={lang === "zh" ? "zh-CN" : "en"} className="backdrop min-h-screen lg:flex">
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:z-[60] focus:left-4 focus:top-4 focus:px-3 focus:py-2 focus:rounded-md focus:bg-zinc-900 focus:text-zinc-50">Skip to content</a>

      {/* 语言切换：大屏固定右上角 */}
      <Link href={t.switchHref}
        className="hidden lg:inline-flex fixed z-50 right-8 top-6 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-black/40 backdrop-blur font-mono text-xs text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors">
        {t.switchLabel}
      </Link>

      {/* 左侧栏：大屏 */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-72 shrink-0 flex-col px-10 py-16 border-r border-zinc-900/80">
        <a href="#about" className="flex flex-col gap-5">
          <Avatar size="lg" />
          <span>
            <span className="block text-2xl font-semibold tracking-tight text-zinc-50">Michael</span>
            <span className="mt-1.5 block font-mono text-xs text-zinc-400">{UI.role}</span>
          </span>
        </a>
        <div className="mt-14">
          <SideNav items={nav} />
        </div>
        <div className="mt-auto flex gap-4 text-sm">
          {external.map((e) => (
            <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 py-1.5 text-zinc-400 hover:text-zinc-100 transition-colors">
              {e.label}
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </aside>

      {/* 顶栏：小屏 */}
      <header className="lg:hidden sticky top-0 z-40 border-b border-zinc-900 bg-[#08090a]/85 backdrop-blur pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center gap-2 px-4 py-1">
          <a href="#about" aria-label="Michael" className="shrink-0 hidden min-[400px]:block"><Avatar size="sm" /></a>
          <MobileNav items={nav} />
          <Link href={t.switchHref}
            className="shrink-0 grid place-items-center min-w-11 h-9 px-3 rounded-full border border-zinc-800 font-mono text-xs text-zinc-300 active:bg-zinc-900">
            {t.switchLabel}
          </Link>
        </div>
      </header>

      <main className="flex-1 min-w-0">
        <div className="max-w-3xl mx-auto px-5 sm:px-10 pt-14 sm:pt-24 pb-16 space-y-16 sm:space-y-24">

          {/* 简介 */}
          <section id="about" className="scroll-mt-24 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-black/30 font-mono text-xs tracking-wide text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {UI.badge}
            </div>
            <div className="font-display text-sm text-zinc-500">
              <span className="text-emerald-400">michael@opc-x</span>:<span className="text-sky-400">~</span>$ whoami
            </div>
            <h1 className="font-display text-[2rem] min-[400px]:text-[2.25rem] sm:text-6xl lg:text-[4.25rem] font-bold tracking-[-0.04em] leading-[1.08]">
              <span className="bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Building small,
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                useful things.
              </span>
              <span aria-hidden className="cursor ml-1 inline-block w-[0.5em] h-[0.85em] -mb-[0.05em] bg-emerald-400" />
            </h1>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">{t.intro}</p>
            <div className="flex flex-wrap gap-2 text-sm lg:hidden">
              {external.map((e) => (
                <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 h-10 px-4 rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-200 active:bg-zinc-800 hover:border-zinc-600 transition-colors">
                  {e.label} <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </section>

          {/* 个人作品 */}
          <section id="built" className="scroll-mt-24 space-y-6">
            <SectionTitle>{UI.built}</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              {PRODUCTS.map((p, i) => {
                const Icon = p.icon;
                const isWip = p.status === "wip";
                const name = typeof p.name === "string" ? p.name : p.name[lang];
                const lastOdd = PRODUCTS.length % 2 === 1 && i === PRODUCTS.length - 1;
                return (
                  <a key={name} href={p.url}
                    target={isWip ? undefined : "_blank"} rel="noopener noreferrer"
                    className={`group relative flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300 active:scale-[0.99] ${lastOdd ? "sm:col-span-2" : ""} ${
                      isWip
                        ? "border-dashed border-zinc-800 cursor-default"
                        : "border-zinc-800/80 bg-zinc-900/40 hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900/80 hover:shadow-[0_20px_40px_-20px_rgba(52,211,153,0.25)]"
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className={`p-2 rounded-lg ${isWip ? "bg-zinc-900 text-zinc-600" : "bg-zinc-800/80 text-zinc-300 group-hover:text-emerald-300 transition-colors"}`}>
                        <Icon size={18} />
                      </span>
                      {isWip ? (
                        <span className="font-mono text-xs text-zinc-500">{p.tag}</span>
                      ) : (
                        <ArrowUpRight size={18} className="text-zinc-500 transition-all group-hover:text-zinc-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-display text-lg font-semibold tracking-tight ${isWip ? "text-zinc-600" : "text-zinc-100"}`}>{name}</span>
                        {!isWip && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/10 font-mono text-xs text-emerald-300 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{UI.live}
                          </span>
                        )}
                      </div>
                      {!isWip && <div className="font-mono text-xs text-zinc-400">{p.tag}</div>}
                      <p className={`pt-1 text-sm leading-relaxed ${isWip ? "text-zinc-600" : "text-zinc-300"}`}>{p.desc}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          {/* 项目经历：public/pages/*.html，放进去就自动出现 */}
          {pages.length > 0 && (
            <section id="work" className="scroll-mt-24 space-y-6">
              <SectionTitle>{UI.work}</SectionTitle>
              <div className="divide-y divide-zinc-800/80 border-y border-zinc-800/80">
                {pages.map((pg) => (
                  <a key={pg.href} href={pg.href}
                    className="group flex items-center gap-4 py-4 transition-colors">
                    <FileText size={18} className="shrink-0 text-zinc-500 group-hover:text-emerald-300 transition-colors" />
                    <span className="flex-1 text-base sm:text-lg text-zinc-200 group-hover:text-white transition-colors">{pg.title}</span>
                    {t.workNote && <span className="font-mono text-xs text-zinc-500">{t.workNote}</span>}
                    <ArrowUpRight size={18} className="text-zinc-500 transition-all group-hover:text-zinc-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* 常用技术 */}
          <section id="tech" className="scroll-mt-24 space-y-6">
            <SectionTitle>{UI.tech}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/40 font-mono text-xs text-zinc-300">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <footer className="pt-8 border-t border-zinc-800/80 flex items-center font-mono text-xs text-zinc-500">
            <span>© 2026 Michael</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
