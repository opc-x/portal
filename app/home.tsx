import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowUpRight, Target, Pickaxe, MessageSquare, BookOpen, Mail, Github, Linkedin, Send } from "lucide-react";
import { listPages, type PageEntry } from "@/lib/pages";
import SideNav, { MobileNav, KeyNav } from "./nav";
import ProjectsList from "./projects-list";

export type Lang = "zh" | "en";

// 头像：public/avatar.jpg / .png / .webp，没有就用字母头像
const AVATAR = ["avatar.jpg", "avatar.png", "avatar.webp"].find((f) =>
  fs.existsSync(path.join(process.cwd(), "public", f)),
);



// 中文只留最小剂量：只有中文版简介一句是中文，其余两版共用英文
const T = {
  zh: {
    intro: ["**资深 Java 后端**，深耕支付与钱包。", "也独立做产品，从想法到上线一个人完成。"],
    workNote: "",
    switchLabel: "EN",
    switchHref: "/en",
  },
  en: {
    intro: ["**Senior Java backend engineer**, deep in payments & wallets.", "I also build my own products — idea to production, solo."],
    workNote: "[zh]",
    switchLabel: "中文",
    switchHref: "/",
  },
};
const UI = {
  badge: "open to work",
  role: "Senior Java backend engineer",
  about: "about",
  built: "projects",
  work: "work",
  tech: "stack",
  live: "Live",
};

// 子页标题是中文，首页上统一显示英文
const TITLE_EN: Record<string, string> = {
  "支付系统": "payout",
  "自持钱包": "wallet",
  "转账": "transfer",
  "兑换": "swap",
  "DApp 入口": "dapp",
};
const enTitle = (t: string) => t.split(" · ").map((x) => TITLE_EN[x.trim()] ?? x).join(" · ");
const toEn = (list: PageEntry[]): PageEntry[] =>
  list.map((e) => ({ ...e, title: enTitle(e.title), children: e.children?.map((c) => ({ ...c, title: enTitle(c.title) })) }));

const PRODUCTS = [
  {
    name: "Quarry",
    tag: "Data mining",
    desc: "Pulls roles from many job boards and communities into one feed, tagged and scored.",
    url: "https://quarry.opc-x.org",
    icon: Pickaxe,
    status: "live",
  },
  {
    name: "Chisel",
    tag: "Job search",
    desc: "Profiles each target role, scores your fit and tracks every application.",
    url: "https://chisel.opc-x.org",
    icon: Target,
    status: "live",
  },
  {
    name: "TalkFlow",
    tag: "AI chat",
    desc: "Streaming AI chat with ready-made scenario prompts, model switching and live collaboration.",
    url: "https://v0-talkflow-homepage-component.vercel.app",
    icon: MessageSquare,
    status: "live",
  },
  {
    name: "Plain",
    tag: "English learning",
    desc: "Learn and practice the 850 core words of Ogden's Basic English.",
    url: "https://plain.opc-x.org",
    icon: BookOpen,
    status: "live",
  },
];

const STACK: [string, string[]][] = [
  ["api", ["Java", "Spring Boot", "Kafka"]],
  ["db", ["MySQL", "PostgreSQL", "Redis"]],
  ["web", ["TypeScript", "Next.js", "React"]],
  ["ops", ["Vercel", "LLM APIs"]],
];
const SHA = (process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7);
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Avatar({ size }: { size: "sm" | "lg" }) {
  const cls = size === "lg" ? "w-20 h-20 text-2xl" : "w-9 h-9 text-sm";
  return AVATAR ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/${AVATAR}`} alt="Michael"
      className={`${cls} rounded-full object-cover grayscale-[15%]`} />
  ) : (
    <span className={`${cls} rounded-full grid place-items-center bg-gradient-to-br from-emerald-400/30 to-zinc-800 ring-1 ring-zinc-700 font-bold`}>M</span>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// **加粗** 的片段高亮
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 ? <span key={i} className="text-zinc-100">{part}</span> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-display text-sm text-zinc-500"><span className="text-emerald-400/70">{"// "}</span>{children}</h2>
    </div>
  );
}

export default function Home({ lang }: { lang: Lang }) {
  const t = T[lang];
  // 英文子页没写就用中文子页，标题翻成英文
  const enPages = listPages("en");
  const pages = toEn(enPages.length > 0 ? enPages : listPages("zh"));

  const nav = [
    { id: "about", label: UI.about },
    { id: "built", label: UI.built },
    ...(pages.length > 0 ? [{ id: "work", label: UI.work, children: pages }] : []),
    { id: "tech", label: UI.tech },
  ];
  const external = [
    { label: "Email", href: "mailto:jcui1@my.hpu.edu", icon: <Mail size={18} /> },
    { label: "GitHub", href: "https://github.com/opc-x", icon: <Github size={18} /> },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/michael-java-backend/", icon: <Linkedin size={18} /> },
    { label: "X", href: "https://x.com/Michaelcjfw", icon: <XLogo /> },
    { label: "Telegram", href: "https://t.me/Michaelcfw", icon: <Send size={18} /> },
  ];

  const iconLink = "text-zinc-500 hover:text-zinc-50 transition-colors";
  const row = "group flex items-baseline gap-4 py-5 border-b border-zinc-800/60 transition-colors";
  const arrow = "shrink-0 self-center text-zinc-600 transition-all group-hover:text-emerald-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

  return (
    <div lang={lang === "zh" ? "zh-CN" : "en"} className="backdrop min-h-screen lg:flex lg:justify-center">
      <div className="dots" aria-hidden />
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:z-[60] focus:left-4 focus:top-4 focus:px-3 focus:py-2 focus:rounded-md focus:bg-zinc-900 focus:text-zinc-50">Skip to content</a>

      {/* 语言切换：大屏固定右上角 */}
      <Link href={t.switchHref}
        className="hidden lg:block fixed z-50 right-10 top-8 font-display text-xs text-zinc-500 hover:text-zinc-50 transition-colors">
        {t.switchLabel}
      </Link>

      {/* 左侧栏：大屏 */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-[22rem] shrink-0 flex-col px-8 py-16">
        <a href="#about" className="flex flex-col gap-6">
          <Avatar size="lg" />
          <span className="font-display">
            <span className="block text-[1.75rem] leading-none font-bold tracking-tight text-zinc-50">Michael C.</span>
            <span className="mt-3 block text-sm text-zinc-400">{UI.role}</span>
          </span>
        </a>
        <div className="mt-14">
          <SideNav items={nav} />
        </div>
        <div className="mt-auto flex gap-5">
          {external.map((e) => (
            <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer" aria-label={e.label} title={e.label} className={iconLink}>
              {e.icon}
            </a>
          ))}
        </div>
      </aside>

      {/* 顶栏：小屏 */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#07080a]/80 backdrop-blur pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center gap-2 px-4 py-1">
          <MobileNav items={nav} />
          <Link href={t.switchHref}
            className="shrink-0 grid place-items-center min-w-11 h-11 font-display text-xs text-zinc-400 active:text-zinc-50">
            {t.switchLabel}
          </Link>
        </div>
      </header>

      <main className="flex-1 min-w-0 max-w-3xl">
        <div className="max-w-3xl mx-auto px-6 sm:px-12 pt-16 sm:pt-32 pb-16 space-y-24 sm:space-y-32">

          {/* 简介 */}
          <section id="about" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8 lg:hidden">
              <Avatar size="sm" />
              <div className="font-display">
                <div className="text-lg font-bold leading-tight text-zinc-50">Michael C.</div>
                <div className="text-xs text-zinc-400">{UI.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 font-display text-xs text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {UI.badge}
            </div>
            <div className="mt-10 font-display text-sm text-zinc-600">
              ~ $ <span className="type text-zinc-400">whoami</span>
            </div>
            <h1 className="mt-4 font-display text-[2rem] min-[400px]:text-[2.25rem] sm:text-6xl font-bold tracking-[-0.04em] leading-[1.1] text-zinc-50">
              Building small,
              <br />
              <span className="text-emerald-400">useful things.</span>
              <span aria-hidden className="cursor ml-[0.12em] inline-block w-[0.26em] h-[0.66em] bg-emerald-400/80" />
            </h1>
            <div className="mt-8 max-w-xl space-y-1 text-base sm:text-lg leading-relaxed text-zinc-400">
              {t.intro.map((line) => (
                <p key={line}><Rich text={line} /></p>
              ))}
            </div>
            <Link href="/resume"
              className="group mt-8 inline-flex items-center gap-2 font-display text-sm text-zinc-500 hover:text-emerald-400 transition-colors">
              <span className="text-zinc-600">$</span> cat resume.md
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <div className="mt-10 flex gap-2 -ml-3 lg:hidden">
              {external.map((e) => (
                <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer" aria-label={e.label} title={e.label}
                  className={`grid place-items-center w-11 h-11 ${iconLink}`}>
                  {e.icon}
                </a>
              ))}
            </div>
          </section>

          {/* 个人作品 */}
          <section id="built" className="scroll-mt-24">
            <SectionTitle>{UI.built}</SectionTitle>
            <ProjectsList />
          </section>

          {/* 项目经历：public/pages/*.html，放进去就自动出现 */}
          {pages.length > 0 && (
            <section id="work" className="scroll-mt-24">
              <SectionTitle>{UI.work}</SectionTitle>
              <div className="mt-6 font-display text-sm text-zinc-500">$ ls -l ~/work</div>
              <div className="mt-4 border-t border-zinc-800/60 font-display">
                {pages.map((pg) => (
                  <a key={pg.href} href={pg.href} className={`${row} items-center`}>
                    <span className="hidden sm:inline text-xs text-zinc-600">drwxr-xr-x</span>
                    <span className="flex-1 min-w-0 truncate text-sm sm:text-base text-sky-300 group-hover:text-sky-200 transition-colors">{slug(pg.title)}/</span>
                    {t.workNote && <span className="text-xs text-zinc-500">{t.workNote}</span>}
                    <ArrowUpRight size={16} className={arrow} />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* 常用技术 */}
          <section id="tech" className="scroll-mt-24">
            <SectionTitle>{UI.tech}</SectionTitle>
            <pre className="mt-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl border border-zinc-800 bg-black/50 p-4 sm:p-5 font-display text-xs sm:text-sm leading-7 text-zinc-300">
              <code>
                <span className="text-zinc-600">{"// stack.ts"}</span>{"\n"}
                <span className="text-fuchsia-400">export const</span> <span className="text-sky-300">stack</span> = {"{"}{"\n"}
                {STACK.map(([k, v]) => (
                  <span key={k}>
                    {"  "}<span className="text-zinc-400">{k}</span>: [{v.map((x, i) => (
                      <span key={x}><span className="text-emerald-300">&quot;{x}&quot;</span>{i < v.length - 1 ? ", " : ""}</span>
                    ))}],{"\n"}
                  </span>
                ))}
                {"};"}
              </code>
            </pre>
          </section>

          <footer className="pt-10 font-display text-xs text-zinc-600">
            © 2026 Michael C. · {SHA}
          </footer>
          <KeyNav ids={nav.map((n) => n.id)} />
        </div>
      </main>
    </div>
  );
}
