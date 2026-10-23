import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import PrintButton from "./print";

export const metadata: Metadata = {
  title: "Resume — Michael C.",
  description: "Senior Java backend engineer. 13 years, from Alibaba and DiDi to wallets and payments. Open to remote roles.",
};

const SUMMARY = [
  "Senior Java backend engineer with 13 years of experience, from Alibaba and DiDi (China's Uber) to crypto and licensed payments.",
  "For the past 4 years I've owned wallet systems where every bug costs real money: a non-custodial multi-chain wallet at HTX/Huobi (~12M users) and a MAS-licensed e-wallet at dtcpay in Singapore.",
  "I take a module from design to production on my own and work well in async, remote teams across time zones.",
];

const SKILLS: [string, string][] = [
  ["Java / Spring Boot", "thread pools, JVM OOM troubleshooting, transaction pitfalls"],
  ["MySQL", "index design, cursor pagination, conditional updates + row locks"],
  ["Redis", "caching, distributed locks, Bloom filters"],
  ["Kafka", "reliable delivery, idempotent consumers"],
  ["Payments", "idempotency, state machines, channel integration, reconciliation"],
  ["Blockchain", "wallet creation, transaction broadcast, block scanning, reorg handling"],
];

type Job = { company: string; note?: string; title: string; period: string; place: string; intro?: string; points: string[] };

const JOBS: Job[] = [
  {
    company: "dtcpay",
    title: "Senior Java Backend Engineer — E-Wallet Owner",
    period: "Apr 2024 – Present",
    place: "Singapore",
    intro: "MAS-licensed payment institution (fiat + stablecoin). Owned the core flow of the consumer e-wallet app: top-up → withdrawal → daily reconciliation; every balance change is booked by the wallet service.",
    points: [
      "Concurrency safety (no overdraft): a single conditional UPDATE checks and deducts the balance under a row lock, so concurrent debits queue up and never go negative.",
      "Idempotent APIs: one-time Redis tokens block duplicate submits; a unique index on the business order ID is the final guard.",
      "Lost-callback recovery: verify signature and amount on channel callbacks; scheduled jobs query the channel to recover missed notifications.",
      "Idempotent payouts: freeze funds before payout; on channel timeout only query, never resend; deduct on success, unfreeze on failure.",
      "Eventual consistency: debit and pending notification are written in one DB transaction, then delivered via Kafka with retries (local message table).",
    ],
  },
  {
    company: "HTX",
    note: "formerly Huobi — crypto exchange",
    title: "Senior Java Backend Engineer — Blockchain Wallet Owner",
    period: "May 2022 – Apr 2024",
    place: "",
    intro: "Huobi Wallet: a non-custodial multi-chain wallet with ~12M users (private keys stay on the user's phone). Owned the core flow: wallet creation → on-chain transfer → deposit detection → deposit notification.",
    points: [
      "Chain reorgs: detect broken parentHash links, roll back and rescan; credit deposits only after enough confirmations.",
      "OOM fix: the block scanner crashed while catching up; root-caused an unbounded queue holding blocks in memory and switched to a bounded queue with back-pressure.",
      "Reliable delivery + idempotent consumption with Kafka: persist notifications before sending; each deposit is pushed exactly once.",
      "Address filtering with a Bloom filter: discard non-user addresses in each block before hitting the database.",
      "Scanner HA with a Redis distributed lock: one active scanner, automatic failover, resume from the saved cursor.",
    ],
  },
  {
    company: "DiDi",
    note: "China's Uber",
    title: "Senior Java Backend Engineer",
    period: "Oct 2018 – May 2022",
    place: "Hangzhou, China",
    intro: "Ride-hailing platform. Tech lead of the company-wide search service.",
    points: [
      "Built the search service from 0 to 1 on Elasticsearch; weekly traffic grew from 60K to 100K.",
      "Built SQL lineage parsing that automatically extracts upstream/downstream table dependencies, exposed as a query service.",
      "Provided unified query APIs consumed by systems across the company.",
    ],
  },
  {
    company: "Alibaba",
    title: "Java Backend Engineer — Distributed Job Scheduling",
    period: "Oct 2016 – Oct 2018",
    place: "Hangzhou, China",
    intro: "Alibaba Group. Core developer of the group's internal distributed job scheduling system: job assignment, execution and timed triggers.",
    points: [
      "Master HA: nodes compete for a database row lock (SELECT … FOR UPDATE); when the master dies the lock is released and another node takes over automatically.",
      "Job sharding: machines map to a fixed set of logical nodes, so scaling in/out only changes the mapping (similar to consistent hashing).",
      "Quartz-based scheduling of 1M+ hourly/daily/weekly/monthly jobs; average job development time dropped from 36h to 17.45h after launch.",
    ],
  },
  {
    company: "Ourpalm",
    note: "mobile games",
    title: "Java Backend Engineer",
    period: "Mar 2013 – Oct 2016",
    place: "Beijing, China",
    intro: "Mobile game company listed on the Shenzhen ChiNext board. Built the shared server side used by multiple games: log collection SDK and operations admin.",
    points: [
      "Designed and built a server-side game log collection SDK adopted by multiple mobile games.",
      "Developed and maintained the Java operations admin system and its scheduled jobs.",
    ],
  },
];

const EDUCATION = [
  { school: "Hawaii Pacific University", degree: "M.S. Artificial Intelligence", period: "Jan 2025 – Jul 2026", note: "GPA 3.88 / 4.0 · With Distinction" },
  { school: "University of Electronic Science and Technology of China", degree: "B.Eng. Computer Science and Technology", period: "Sep 2008 – Jul 2012", note: "" },
];

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-sm text-zinc-500 print:text-zinc-700">
      <span className="text-emerald-400/70 print:hidden">{"// "}</span>{children}
    </h2>
  );
}

export default function Resume() {
  return (
    <div lang="en" className="backdrop min-h-screen print:bg-white print:before:hidden print:after:hidden">
      <div className="dots print:hidden" aria-hidden />
      <main className="max-w-3xl mx-auto px-6 sm:px-12 pt-10 sm:pt-16 pb-20 print:p-0 print:max-w-none print:text-black">
        <div className="flex items-center justify-between font-display text-xs text-zinc-500 print:hidden">
          <Link href="/en" className="inline-flex items-center gap-2 hover:text-zinc-50 transition-colors">
            <ArrowLeft size={14} /> michael.opc-x.org
          </Link>
          <PrintButton icon={<Printer size={14} />} />
        </div>

        <header className="mt-12 print:mt-0">
          <div className="font-display text-sm text-zinc-600 print:hidden">~ $ cat resume.md</div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-zinc-50 print:text-black print:text-3xl">
            Michael C.
          </h1>
          <p className="mt-3 text-lg text-zinc-300 print:text-zinc-800">Senior Java Backend Engineer · Payments &amp; Wallets · Distributed Systems</p>
          <p className="mt-2 font-display text-xs sm:text-sm text-zinc-500 print:text-zinc-700">
            Open to remote roles · <a href="https://michael.opc-x.org/en" className="text-emerald-400 underline decoration-emerald-400/40 underline-offset-4 hover:decoration-emerald-400 print:text-[#1d4f80]">michael.opc-x.org ↗</a>
          </p>
        </header>

        <section className="mt-14 print:mt-6">
          <H>summary</H>
          <div className="mt-4 space-y-2 text-zinc-400 leading-relaxed print:text-zinc-900">
            {SUMMARY.map((s) => <p key={s}>{s}</p>)}
          </div>
        </section>

        <section className="mt-14 print:mt-6 print:break-inside-avoid">
          <H>skills</H>
          <dl className="mt-4 grid sm:grid-cols-[11rem_1fr] gap-x-6 gap-y-2 text-sm">
            {SKILLS.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="font-display text-zinc-100 print:text-black">{k}</dt>
                <dd className="text-zinc-400 print:text-zinc-800 mb-2 sm:mb-0">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14 print:mt-6">
          <H>experience</H>
          <div className="mt-4 space-y-10 print:space-y-5">
            {JOBS.map((j) => (
              <article key={j.company} className="border-t border-zinc-800/60 pt-6 print:pt-3 print:border-zinc-300 print:break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <h3 className="font-display text-base text-zinc-50 print:text-black">
                    {j.company}
                    {j.note && <span className="ml-2 text-xs text-zinc-500 print:text-zinc-600">({j.note})</span>}
                  </h3>
                  <span className="font-display text-xs text-zinc-500 print:text-zinc-700">{j.period}{j.place && ` · ${j.place}`}</span>
                </div>
                <div className="mt-1 text-sm text-emerald-300/90 print:text-zinc-800">{j.title}</div>
                {j.intro && <p className="mt-3 text-sm leading-relaxed text-zinc-400 print:text-zinc-900">{j.intro}</p>}
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-zinc-400 print:text-zinc-900">
                  {j.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="text-zinc-600 print:text-zinc-500" aria-hidden>–</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 print:mt-6 print:break-inside-avoid">
          <H>education</H>
          <div className="mt-4 space-y-4">
            {EDUCATION.map((e) => (
              <div key={e.school} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div>
                  <div className="font-display text-sm text-zinc-50 print:text-black">{e.school}</div>
                  <div className="text-sm text-zinc-400 print:text-zinc-800">
                    {e.degree}{e.note && <span className="text-zinc-500 print:text-zinc-700"> · {e.note}</span>}
                  </div>
                </div>
                <span className="font-display text-xs text-zinc-500 print:text-zinc-700">{e.period}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
