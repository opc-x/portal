"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { PageEntry } from "@/lib/pages";

type Item = { id: string; label: string; children?: PageEntry[] };

// 二级分组：默认折叠，点组名直接进组里第一页，点箭头展开子页
function Group({ entry }: { entry: PageEntry }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <a href={entry.href} className="py-1 text-zinc-400 hover:text-zinc-100 transition-colors">{entry.title}</a>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={`Expand ${entry.title}`}
          className="p-1.5 -m-0.5 text-zinc-500 hover:text-zinc-200 transition-colors">
          <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="ml-1 mb-1 flex flex-col gap-1 border-l border-zinc-800 pl-3">
          {entry.children!.map((c) => (
            <a key={c.href} href={c.href} className="py-1 text-zinc-400 hover:text-zinc-100 transition-colors">{c.title}</a>
          ))}
        </div>
      )}
    </div>
  );
}

// 滚动到哪一节，哪一项就高亮（左栏和手机顶栏共用）
function useActive(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(",");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // 滚到底时最后一节可能够不到触发线，直接点亮最后一项
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) setActive(ids[ids.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

// 手机顶栏：可横滑，当前节高亮，右侧渐隐提示还能滑
export function MobileNav({ items }: { items: Item[] }) {
  const active = useActive(items.map((i) => i.id));
  // 当前项被挤到屏外时，横向滚过去
  useEffect(() => {
    document.querySelector(`[data-mnav="${active}"]`)?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [active]);
  return (
    <nav aria-label="Sections"
      className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto whitespace-nowrap font-display text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,#000_85%,transparent)]">
      {items.map((n) => {
        const on = active === n.id;
        return (
          <a key={n.id} href={`#${n.id}`} data-mnav={n.id} aria-current={on ? "true" : undefined}
            className={`shrink-0 px-2.5 py-2.5 rounded-md transition-colors ${on ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-100"}`}>
            <span className={`pb-1 border-b ${on ? "border-emerald-400" : "border-transparent"}`}>{n.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

// 左侧导航
export default function SideNav({ items }: { items: Item[] }) {
  const active = useActive(items.map((i) => i.id));

  return (
    <nav aria-label="Sections" className="flex flex-col gap-1 font-display text-sm">
      {items.map((n, idx) => {
        const on = active === n.id;
        return (
          <div key={n.id}>
            <a href={`#${n.id}`} aria-current={on ? "true" : undefined}
              className={`group flex items-center gap-3 py-2 transition-colors ${on ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-100"}`}>
              <span className={`text-xs ${on ? "text-emerald-400" : "text-zinc-600"}`}>{String(idx + 1).padStart(2, "0")}</span>
              <span className={`h-px transition-all duration-300 ${on ? "w-8 bg-emerald-400" : "w-4 bg-zinc-600 group-hover:w-6 group-hover:bg-zinc-400"}`} />
              {n.label}
            </a>
            {n.children && n.children.length > 0 && (
              <div className="ml-7 mt-1 mb-2 flex flex-col gap-1 border-l border-zinc-800 pl-3">
                {n.children.map((c) => c.children ? <Group key={c.href} entry={c} /> : (
                  <a key={c.href} href={c.href} className="py-1 text-zinc-400 hover:text-zinc-100 transition-colors">
                    {c.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// 键盘：按 1–N 跳到对应小节
export function KeyNav({ ids }: { ids: string[] }) {
  const key = ids.join(",");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const n = Number(e.key);
      if (n >= 1 && n <= ids.length) document.getElementById(ids[n - 1])?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}
