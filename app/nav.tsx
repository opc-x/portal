"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { PageEntry } from "@/lib/pages";

type Item = { id: string; label: string; children?: PageEntry[] };

const subCls =
  "group flex items-center gap-2.5 py-1 whitespace-nowrap text-[13px] text-zinc-500 hover:text-zinc-100 transition-colors";

const SubLine = ({ small = false }: { small?: boolean }) => (
  <span
    aria-hidden
    className={`h-px bg-zinc-800 transition-all duration-300 group-hover:bg-emerald-400/80 ${
      small ? "w-2 group-hover:w-3.5" : "w-3 group-hover:w-5"
    }`}
  />
);

// 二级分组：默认折叠，纯横线极简风，箭头紧贴文字不再悬空到最右侧
function Group({ entry }: { entry: PageEntry }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-1">
        <a href={entry.href} className={subCls}>
          <SubLine />
          <span>{entry.title}</span>
        </a>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={`Expand ${entry.title}`}
          className="p-1 text-zinc-600 hover:text-emerald-400 transition-colors"
        >
          <ChevronRight
            size={13}
            className={`transition-transform duration-200 ${open ? "rotate-90 text-emerald-400/80" : ""}`}
          />
        </button>
      </div>
      {open && (
        <div className="ml-5 my-0.5 pl-3 border-l border-zinc-800/70 flex flex-col gap-0.5">
          {entry.children!.map((c) => (
            <a key={c.href} href={c.href} className={subCls}>
              <SubLine small />
              <span className="text-xs">{c.title}</span>
            </a>
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
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4)
        setActive(ids[ids.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

// 手机顶栏：可横滑，当前节高亮，右侧渐隐提示还能滑
export function MobileNav({ items }: { items: Item[] }) {
  const active = useActive(items.map((i) => i.id));
  useEffect(() => {
    document.querySelector(`[data-mnav="${active}"]`)?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [active]);
  return (
    <nav
      aria-label="Sections"
      className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto whitespace-nowrap font-display text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,#000_85%,transparent)]"
    >
      {items.map((n) => {
        const on = active === n.id;
        return (
          <a
            key={n.id}
            href={`#${n.id}`}
            data-mnav={n.id}
            aria-current={on ? "true" : undefined}
            className={`shrink-0 px-2.5 py-2.5 rounded-md transition-colors ${
              on ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-100"
            }`}
          >
            <span className={on ? "text-emerald-400" : ""}>{n.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

// 左侧导航：全套极简伸缩横线风格
export default function SideNav({ items }: { items: Item[] }) {
  const active = useActive(items.map((i) => i.id));

  return (
    <nav aria-label="Sections" className="flex flex-col gap-1 font-display text-[15px]">
      {items.map((n, idx) => {
        const on = active === n.id;
        return (
          <div key={n.id}>
            <a
              href={`#${n.id}`}
              aria-current={on ? "true" : undefined}
              className={`group flex items-center gap-3 py-2 transition-colors ${
                on ? "text-zinc-50" : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <span className={`text-xs tabular-nums transition-colors ${on ? "text-emerald-400" : "text-zinc-700"}`}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className={`h-px transition-all duration-300 ${
                  on ? "w-8 bg-emerald-400" : "w-4 bg-zinc-700 group-hover:w-6 group-hover:bg-zinc-400"
                }`}
              />
              {n.label}
            </a>
            {n.children && n.children.length > 0 && (
              <div className="ml-[2.15rem] pl-3 border-l border-zinc-800/60 my-0.5 flex flex-col gap-0.5">
                {n.children.map((c) =>
                  c.children ? (
                    <Group key={c.href} entry={c} />
                  ) : (
                    <a key={c.href} href={c.href} className={subCls}>
                      <SubLine />
                      <span>{c.title}</span>
                    </a>
                  ),
                )}
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
