"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import type { ResumeDoc } from "./data";

type Section = ResumeDoc["sections"][number];
type Job = NonNullable<Section["jobs"]>[number];

const VERSIONS: { id: ResumeDoc["id"]; href: string; label: string }[] = [
  { id: "en", href: "/resume", label: "English" },
  { id: "zh", href: "/resume/zh", label: "中文远程" },
  { id: "onsite", href: "/resume/onsite", label: "中文现场" },
];

function ContextLine({ job }: { job: Job }) {
  const site = job.website;
  if (site && job.context.endsWith(site.text)) {
    const prefix = job.context.slice(0, -site.text.length);
    return (
      <p className="mt-2 text-sm leading-relaxed text-zinc-500 print:text-zinc-600">
        {prefix}
        <a href={site.href} className="text-emerald-400/90 underline decoration-emerald-400/30 underline-offset-4 hover:decoration-emerald-400 print:text-[#1d4f80]">{site.text}</a>
      </p>
    );
  }
  return (
    <>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500 print:text-zinc-600">{job.context}</p>
      {site && (
        <p className="mt-1 text-sm text-zinc-500 print:text-zinc-600">
          {site.label}:{" "}
          <a href={site.href} className="text-emerald-400/90 underline decoration-emerald-400/30 underline-offset-4 hover:decoration-emerald-400 print:text-[#1d4f80]">{site.text}</a>
        </p>
      )}
    </>
  );
}

function SectionBody({ section, lang }: { section: Section; lang: "en" | "zh" }) {
  if (section.paragraphs) {
    return (
      <div className={`mt-4 space-y-3 text-[15px] text-zinc-300 print:text-zinc-900 ${lang === "zh" ? "leading-8" : "leading-7"}`}>
        {section.paragraphs.map((p) => <p key={p}>{p}</p>)}
      </div>
    );
  }
  if (section.id === "how" && section.pairs) {
    return (
      <dl className="mt-4 space-y-3">
        {section.pairs.map((pair) => (
          <div key={pair.lead} className="grid gap-1 sm:grid-cols-[15rem_1fr] sm:gap-6">
            <dt className="text-sm font-medium text-zinc-100 print:text-black">{pair.lead}</dt>
            <dd className={`text-sm text-zinc-400 print:text-zinc-800 ${lang === "zh" ? "leading-7" : "leading-6"}`}>{pair.text}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (section.id === "skills" && section.pairs) {
    return (
      <dl className="mt-4 divide-y divide-zinc-800/80 border-y border-zinc-800/80 print:divide-zinc-200 print:border-zinc-300">
        {section.pairs.map((pair) => (
          <div key={pair.lead} className={`grid gap-1 py-3 sm:items-baseline ${lang === "zh" ? "sm:grid-cols-[5.5rem_1fr]" : "sm:grid-cols-[11.5rem_1fr]"} sm:gap-6`}>
            <dt className="font-display text-sm text-emerald-300/90 print:font-sans print:font-semibold print:text-[#1d4f80]">{pair.lead}</dt>
            <dd className={`text-sm text-zinc-400 print:text-zinc-800 ${lang === "zh" ? "leading-7" : "leading-6"}`}>{pair.text}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (section.jobs) {
    return (
      <ol className="relative mt-6 space-y-10 border-l border-zinc-800 print:space-y-6 print:border-zinc-300">
        {section.jobs.map((job) => (
          <li key={job.company + job.dates} className="relative pl-5 sm:pl-7 print:break-inside-avoid">
            <span aria-hidden className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-emerald-400 ring-4 ring-[#07080a] print:bg-[#1d4f80] print:ring-white" />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <a href={job.href} className="font-display text-lg font-semibold tracking-tight text-zinc-50 underline decoration-transparent underline-offset-4 hover:decoration-emerald-400/60 print:font-sans print:text-black print:no-underline">
                {job.company}
              </a>
              <time className="shrink-0 font-display text-xs text-zinc-500 print:text-zinc-600">{job.dates}</time>
            </div>
            <p className="mt-1 text-sm text-emerald-200/90 print:font-medium print:text-[#1d4f80]">{job.role}</p>
            <ContextLine job={job} />
            <p className={`mt-3 text-sm text-zinc-300 print:text-zinc-900 ${lang === "zh" ? "leading-7" : "leading-6"}`}>{job.intro}</p>
            <ul className="mt-3 space-y-2">
              {job.points.map((point) => (
                <li key={(point.lead ?? "") + point.text} className={`flex gap-3 text-sm text-zinc-400 print:text-zinc-900 ${lang === "zh" ? "leading-7" : "leading-6"}`}>
                  <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-zinc-600 print:bg-zinc-400" />
                  <span>
                    {point.lead && <span className="font-medium text-zinc-100 print:text-black">{point.lead}</span>}
                    {point.text}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    );
  }
  if (section.projects) {
    return (
      <div className="mt-4 divide-y divide-zinc-800/80 border-y border-zinc-800/80 print:divide-zinc-200 print:border-zinc-300">
        {section.projects.map((project) => (
          <article key={project.url} className="py-4">
            <a href={project.href} className="text-base font-medium text-zinc-50 underline decoration-transparent underline-offset-4 hover:decoration-emerald-400/60 print:text-black">
              {project.name}
            </a>
            <p className={`mt-1.5 text-sm text-zinc-400 print:text-zinc-800 ${lang === "zh" ? "leading-7" : "leading-6"}`}>{project.text}</p>
            <a href={project.href} className="mt-2 inline-block font-display text-sm text-emerald-400 underline decoration-emerald-400/30 underline-offset-4 hover:decoration-emerald-400 print:text-[#1d4f80]">
              {project.url}
            </a>
          </article>
        ))}
      </div>
    );
  }
  if (section.items) {
    return (
      <div className="mt-4 space-y-4">
        {section.items.map((edu) => (
          <div key={edu.school} className="flex flex-col gap-1 border-t border-zinc-800/80 pt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 print:border-zinc-300">
            <div>
              <div className="text-sm font-medium text-zinc-50 print:text-black">{edu.school}</div>
              <div className="mt-1 text-sm text-zinc-400 print:text-zinc-800">{edu.detail}</div>
            </div>
            <time className="shrink-0 font-display text-xs text-zinc-500 print:text-zinc-600">{edu.dates}</time>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function ResumeView({ doc }: { doc: ResumeDoc }) {
  const sections = doc.sections.map((s) => ({ id: s.id, label: s.heading }));
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const nodes = doc.sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [doc]);

  const linkCls = (id: string, desktop: boolean) =>
    desktop
      ? `flex items-baseline gap-3 py-1.5 text-left text-[13px] leading-snug transition-colors ${active === id ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-200"}`
      : `shrink-0 rounded-md px-2.5 py-1.5 text-xs transition-colors ${active === id ? "bg-emerald-400/10 text-emerald-300" : "text-zinc-500 hover:text-zinc-200"}`;

  return (
    <div lang={doc.htmlLang} className="resume-root backdrop min-h-screen text-zinc-300 print:bg-white print:text-black">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" />
      <div className="dots print:hidden" aria-hidden />
      <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:grid lg:grid-cols-[228px_minmax(0,1fr)] lg:gap-12 lg:px-8 xl:gap-16">
        <aside className="sticky top-0 z-30 print:hidden lg:top-0 lg:z-auto lg:flex lg:h-screen lg:flex-col lg:py-10">
          <div className="border-b border-zinc-800/80 bg-[#07080a]/88 py-3 backdrop-blur-md lg:border-0 lg:bg-transparent lg:py-0 lg:backdrop-blur-none">
            <Link href={doc.home.href} className="mb-6 hidden items-center gap-2 font-display text-xs text-zinc-500 transition-colors hover:text-zinc-50 lg:inline-flex">
              <ArrowLeft size={14} /> {doc.home.label}
            </Link>
            <div className="grid grid-cols-3 gap-1 lg:grid-cols-1" role="navigation" aria-label="Resume version">
              {VERSIONS.map((v) => {
                const on = v.id === doc.id;
                return (
                  <Link key={v.id} href={v.href} aria-current={on ? "page" : undefined}
                    className={`rounded-md px-2 py-2 text-center font-display text-[11px] leading-none transition-colors sm:text-xs lg:px-3 lg:text-left ${on ? "bg-emerald-400/15 text-emerald-300" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"}`}>
                    {v.label}
                  </Link>
                );
              })}
            </div>
            <a href={doc.download} download={doc.fileName}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-3 py-2.5 font-display text-sm font-semibold text-[#06281c] transition-colors hover:bg-emerald-300 lg:mt-4">
              <Download size={15} />
              {doc.downloadLabel}
            </a>
            <p className="mt-1.5 hidden text-center font-display text-[10px] tracking-wide text-zinc-600 lg:block">{doc.fileName}</p>
            <nav aria-label="Sections" className="mt-2 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
              {sections.map((s) => (
                <a key={`m-${s.id}`} href={`#${s.id}`} className={`${linkCls(s.id, false)} lg:hidden`}>{s.label}</a>
              ))}
              {sections.map((s, i) => (
                <a key={`d-${s.id}`} href={`#${s.id}`} className={`hidden lg:flex ${linkCls(s.id, true)}`}>
                  <span className={`w-5 shrink-0 font-display text-[11px] tabular-nums ${active === s.id ? "text-emerald-400" : "text-zinc-700"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <main className="pb-20 pt-8 sm:pt-10 lg:max-w-[740px] lg:py-12 lg:pb-24 print:max-w-none print:py-0">
          <header>
            <p className="font-display text-sm text-zinc-600 print:hidden">~ $ cat resume.md</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.04em] text-zinc-50 sm:text-5xl print:mt-0 print:font-sans print:text-black print:text-[28pt]">
              {doc.name}
            </h1>
            <p className="mt-3 max-w-xl text-lg leading-snug text-zinc-200 print:text-base print:text-zinc-900">{doc.tagline}</p>
            {doc.availability && (
              <p className="mt-3 inline-flex items-center gap-2 font-display text-xs text-emerald-300/90 print:text-zinc-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 print:hidden" aria-hidden />
                {doc.availability}
              </p>
            )}
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {doc.contacts.map((c) => (
                <li key={c.label} className="text-zinc-500">
                  <span className="font-display text-[11px] uppercase tracking-wide text-zinc-600 print:normal-case print:text-zinc-500">{c.label}</span>
                  {" "}
                  {c.href ? (
                    <a href={c.href} className="text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:text-emerald-300 hover:decoration-emerald-400/50 print:text-[#1d4f80]">{c.text}</a>
                  ) : (
                    <span className="text-zinc-200">{c.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </header>

          {doc.sections.map((section) => (
            <section key={section.id} id={section.id} className="mt-12 scroll-mt-36 lg:scroll-mt-10 print:mt-6">
              <h2 className="font-display text-xs tracking-[0.14em] text-zinc-500 print:border-b print:border-zinc-300 print:pb-1 print:font-sans print:text-[11pt] print:font-bold print:tracking-normal print:text-[#1d4f80]">
                <span className="text-emerald-400/80 print:hidden">{"// "}</span>
                {section.heading}
              </h2>
              <SectionBody section={section} lang={doc.lang} />
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
