import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// /rlist = resource list：站上所有能直接发出去的链接，一页拉清单。
// public/ 下的文件自动扫进来（_ 开头不列），新放文件不用改这里。
export const metadata: Metadata = {
  title: "rlist — Michael C.",
  robots: { index: false, follow: false },
};

const SITE = "https://michael.opc-x.org";
const PUB = path.join(process.cwd(), "public");

// 文件名 → 中文说明；没写的直接显示文件名
const NOTE: Record<string, string> = {
  "resume-en.pdf": "英文简历 PDF（投海外岗）",
  "resume-zh.pdf": "中文简历 PDF · 远程版",
  "resume-zh-onsite.pdf": "中文简历 PDF · 坐班版",
  "resume-zh.html": "中文简历网页 · 远程版",
  "resume-zh-onsite.html": "中文简历网页 · 坐班版",
  "avatar.png": "头像",
};

function walk(dir: string, base = ""): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    if (d.name.startsWith("_") || d.name.startsWith(".")) return [];
    const rel = base ? `${base}/${d.name}` : d.name;
    return d.isDirectory() ? walk(path.join(dir, d.name), rel) : [rel];
  });
}

const titleOf = (rel: string) => {
  if (!rel.endsWith(".html")) return null;
  const html = fs.readFileSync(path.join(PUB, rel), "utf8");
  return html.match(/<title>([^<]*)<\/title>/i)?.[1].trim() ?? null;
};

type Item = { href: string; label: string; note?: string };

export default function RList() {
  const files = walk(PUB).sort();
  const resume: Item[] = [
    { href: "/resume", label: "/resume", note: "英文简历网页（可打印）" },
    ...files.filter((f) => f.startsWith("resume")).map((f) => ({ href: `/${f}`, label: `/${f}`, note: NOTE[f] })),
  ];
  const pages: Item[] = files
    .filter((f) => f.startsWith("pages/"))
    .map((f) => ({ href: `/${f}`, label: `/${f}`, note: titleOf(f) ?? undefined }));
  const other: Item[] = files
    .filter((f) => !f.startsWith("resume") && !f.startsWith("pages/"))
    .map((f) => ({ href: `/${f}`, label: `/${f}`, note: NOTE[f] }));
  const site: Item[] = [
    { href: "/", label: "/", note: "主页 · 中文" },
    { href: "/en", label: "/en", note: "主页 · 英文" },
  ];
  const apps: Item[] = [
    { href: "https://quarry.opc-x.org", label: "quarry.opc-x.org", note: "职位聚合" },
    { href: "https://chisel.opc-x.org", label: "chisel.opc-x.org", note: "投递追踪" },
    { href: "https://plain.opc-x.org", label: "plain.opc-x.org", note: "Basic English 850" },
    { href: "https://echo.opc-x.org", label: "echo.opc-x.org", note: "口语跟读" },
  ];
  const groups: [string, Item[]][] = [
    ["简历", resume],
    ["主页", site],
    ["子页面", pages],
    ["项目", apps],
    ["其他文件", other],
  ];

  return (
    <main className="backdrop min-h-screen text-zinc-200">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300">
          <ArrowLeft size={14} /> home
        </Link>
        <h1 className="mt-4 text-2xl font-bold">rlist</h1>
        <p className="mt-1 text-sm text-zinc-500">站上全部资源，点开即用，链接可直接复制外发。</p>
        {groups.filter(([, l]) => l.length).map(([name, list]) => (
          <section key={name} className="mt-8">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400/80">{name} · {list.length}</h2>
            <ul className="mt-2 divide-y divide-zinc-800/80 border-y border-zinc-800/80">
              {list.map((it) => {
                const full = it.href.startsWith("http") ? it.href : SITE + it.href;
                return (
                  <li key={it.href} className="py-2.5">
                    <a href={it.href} target="_blank" rel="noreferrer" className="block hover:text-emerald-300">
                      <span className="font-mono text-sm break-all">{it.label}</span>
                      {it.note && <span className="ml-2 text-sm text-zinc-500">{it.note}</span>}
                    </a>
                    <span className="block font-mono text-[11px] text-zinc-600 break-all select-all">{full}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
