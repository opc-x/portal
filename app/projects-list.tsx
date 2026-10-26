"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Headphones,
  ShieldCheck,
  Target,
  Pickaxe,
  Globe,
  MessageSquare,
  Library,
  Bot,
  GitBranch,
  FileCode,
  Database,
  Terminal,
} from "lucide-react";

const PROJECTS = [
  // Page 1: Top 3 Flagship Apps (*.opc-x.org)
  {
    name: "Plain",
    desc: "Express anything in plain English with Ogden's 850 core words — 5,400+ real dialogues & AI coach.",
    url: "https://plain.opc-x.org",
    icon: BookOpen,
  },
  {
    name: "Quarry",
    desc: "Multi-channel data mining — pulls roles from BOSS, RemoteOK, V2EX, Telegram, X and more into one feed, tagged and scored.",
    url: "https://quarry.opc-x.org",
    icon: Pickaxe,
  },
  {
    name: "Chisel",
    desc: "Job search tracker — profiles each target role, scores your fit and tracks every application.",
    url: "https://chisel.opc-x.org",
    icon: Target,
  },
  // Page 2
  {
    name: "CallanApp",
    desc: "Interactive Callan Method spoken English trainer (Stages 1–12) with Edge TTS British voice & drills.",
    url: "https://callan.opc-x.org",
    icon: Headphones,
  },
  {
    name: "Signore",
    desc: "Zero-discrepancy wallet ledger & settlement sandbox — atomic row-lock SQL, Redis token idempotency, T+1 recon.",
    url: "https://signore.opc-x.org",
    icon: ShieldCheck,
  },
  {
    name: "PayAtlas",
    desc: "Global payment channel matrix, due-diligence scoring, and unified settlement adapter blueprints.",
    url: "https://opc-x.github.io/PayAtlas/",
    icon: Globe,
  },
  {
    name: "TalkFlow",
    desc: "Scenario-driven English speaking workspace with spaced repetition, blind-spot tracking, and course maps.",
    url: "https://v0-talkflow-homepage-component.vercel.app",
    icon: MessageSquare,
  },
  // Page 3
  {
    name: "Ogden Corpus",
    desc: "Structured Ogden Basic English 850 corpus, 18 operators reference, and interactive word explorer.",
    url: "https://ogden-basic-english-omega.vercel.app",
    icon: Library,
  },
  {
    name: "ZuiTi",
    desc: "Prompt-first reply agent & guardrail engine — composable persona AST and human-in-the-loop approval.",
    url: "https://opc-x.github.io/ZuiTi/",
    icon: Bot,
  },
  {
    name: "TaskBus",
    desc: "Issue-driven multi-agent spiral execution protocol using GitHub Issues as a deterministic state machine.",
    url: "https://opc-x.github.io/taskbus/",
    icon: GitBranch,
  },
  // Page 4
  {
    name: "Prompts",
    desc: "10 C4 & state-machine orchestrator blueprints and visual-first engineering output protocols.",
    url: "https://opc-x.github.io/prompts/",
    icon: FileCode,
  },
  {
    name: "AgentVault",
    desc: "Structured knowledge base and due-diligence report schemas for autonomous research agents.",
    url: "https://opc-x.github.io/AgentVault/",
    icon: Database,
  },
  {
    name: "Common Skills",
    desc: "Reusable Claude Code slash-command skills for recon, PRD shaping, and headless Playwright verification.",
    url: "https://opc-x.github.io/common-skills/",
    icon: Terminal,
  },
];

const PAGE_SIZE = 3;

export default function ProjectsList() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(PROJECTS.length / PAGE_SIZE);
  const current = PROJECTS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const row = "group flex items-baseline gap-4 py-5 border-b border-zinc-800/60 transition-colors";
  const arrow = "shrink-0 self-center text-zinc-600 transition-all group-hover:text-emerald-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5";

  return (
    <div>
      <div className="mt-6 border-t border-zinc-800/60">
        {current.map((p) => {
          const Icon = p.icon;
          return (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className={row}>
              <Icon size={18} aria-hidden className="shrink-0 self-start mt-0.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              <span className="flex-1 min-w-0 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="sm:w-36 shrink-0 font-display text-base text-zinc-100 group-hover:text-emerald-400 transition-colors">{p.name}</span>
                <span className="text-sm leading-relaxed text-zinc-400">{p.desc}</span>
              </span>
              <ArrowUpRight size={16} className={arrow} />
            </a>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between font-display text-xs text-zinc-500">
        <span>
          page <span className="text-emerald-400">0{page + 1}</span> / 0{totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-2.5 py-1 rounded border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            ← prev
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPage(idx)}
              className={`w-7 h-7 rounded border transition-colors ${
                page === idx
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-800/80 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-2.5 py-1 rounded border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            next →
          </button>
        </div>
      </div>
    </div>
  );
}
