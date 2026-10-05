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
        <a href={entry.href} className="py-1 text-zinc-500 hover:text-zinc-100 transition-colors">{entry.title}</a>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={`展开${entry.title}`}
          className="p-1 text-zinc-600 hover:text-zinc-200 transition-colors">
          <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="ml-1 mb-1 flex flex-col gap-1 border-l border-zinc-800 pl-3">
          {entry.children!.map((c) => (
            <a key={c.href} href={c.href} className="py-1 text-zinc-500 hover:text-zinc-100 transition-colors">{c.title}</a>
          ))}
        </div>
      )}
    </div>
  );
}

// 左侧导航：滚动到哪一节，哪一项就高亮
export default function SideNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="flex flex-col gap-1 text-sm">
      {items.map((n) => {
        const on = active === n.id;
        return (
          <div key={n.id}>
            <a href={`#${n.id}`}
              className={`group flex items-center gap-3 py-1.5 transition-colors ${on ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-200"}`}>
              <span className={`h-px transition-all duration-300 ${on ? "w-8 bg-emerald-400" : "w-4 bg-zinc-700 group-hover:w-6 group-hover:bg-zinc-400"}`} />
              {n.label}
            </a>
            {n.children && n.children.length > 0 && (
              <div className="ml-7 mt-1 mb-2 flex flex-col gap-1 border-l border-zinc-800 pl-3">
                {n.children.map((c) => c.children ? <Group key={c.href} entry={c} /> : (
                  <a key={c.href} href={c.href} className="py-1 text-zinc-500 hover:text-zinc-100 transition-colors">
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
