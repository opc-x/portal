import { ExternalLink, Zap, Target, MessageSquare, BookOpen } from "lucide-react";

const PRODUCTS = [
  {
    name: "JobSniper",
    tag: "求职工具",
    desc: "精准狙击目标职位 — 渠道打通 · 职位画像 · 匹配评分",
    url: "https://jobsniper.opc-x.org",
    icon: Target,
    status: "live",
  },
  {
    name: "TalkFlow",
    tag: "AI 对话",
    desc: "流式 AI 对话平台，场景化提示词 · 多模型切换 · 实时协作",
    url: "https://talkflow-peters-projects-48a2541f.vercel.app",
    icon: MessageSquare,
    status: "live",
  },
  {
    name: "Ogden 850",
    tag: "英语学习",
    desc: "基于 Ogden 基础英语 850 词核心词汇的学习与练习工具",
    url: "https://ogden850app.vercel.app",
    icon: BookOpen,
    status: "live",
  },
  {
    name: "下一个",
    tag: "孵化中",
    desc: "正在构建中 — 想法永远比时间多",
    url: "#",
    icon: Zap,
    status: "wip",
  },
];

const SKILLS = [
  "Next.js / React", "TypeScript", "Tailwind CSS",
  "PostgreSQL / Neon", "Vercel", "AI 集成",
  "产品设计", "独立开发", "快速交付",
];

export default function Page() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-20 space-y-24">

      {/* Hero */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          独立构建者 · 一人公司
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          opc-x
        </h1>
        <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
          精准构建有用的产品。<br />
          从想法到上线，一个人搞定。
        </p>
        <div className="flex gap-4 text-sm">
          <a href="https://github.com/opc-x" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors">
            GitHub <ExternalLink size={12} />
          </a>
        </div>
      </section>

      {/* Products */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">产品矩阵</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
        <div className="grid gap-4">
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            const isWip = p.status === "wip";
            return (
              <a
                key={p.name}
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
                    <span className={`font-semibold ${isWip ? "text-zinc-600" : "text-zinc-100"}`}>{p.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      isWip ? "bg-zinc-800 text-zinc-600" : "bg-zinc-800 text-zinc-400"
                    }`}>{p.tag}</span>
                    {!isWip && (
                      <span className="ml-auto flex items-center gap-1 text-xs text-emerald-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        上线
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${isWip ? "text-zinc-700" : "text-zinc-400"}`}>{p.desc}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">能力栈</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span key={s} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-zinc-800 text-xs text-zinc-600 flex items-center justify-between">
        <span>© 2026 opc-x</span>
        <span>独立构建，持续迭代</span>
      </footer>

    </main>
  );
}
