import fs from "fs";
import path from "path";

// 子页面：把 HTML 文件放进 public/pages/ 就会出现在首页「写的东西」里。
//   xxx.html     → 中文首页
//   xxx.en.html  → 英文首页
//   _开头的文件  → 不展示（比如 _template.html）
// 列表标题取文件里的 <title>，按文件名排序。
// 标题写成「组名 · 子标题」的几页会合成一组：组名点进去是组里第一页，
// 组内顺序用 <meta name="order" content="1">，没写的排在后面按文件名。
const DIR = path.join(process.cwd(), "public", "pages");

export type PageLink = { href: string; title: string };
export type PageEntry = PageLink & { children?: PageLink[] };

export function listPages(lang: "zh" | "en"): PageEntry[] {
  if (!fs.existsSync(DIR)) return [];
  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".html") && !f.startsWith("_"))
    .filter((f) => (lang === "en") === f.endsWith(".en.html"))
    .sort()
    .map((f) => {
      const html = fs.readFileSync(path.join(DIR, f), "utf8");
      const title = html.match(/<title>([^<]*)<\/title>/i)?.[1].trim() || f.replace(/(\.en)?\.html$/, "");
      const order = Number(html.match(/<meta name="order" content="(\d+)"/i)?.[1] ?? Infinity);
      return { href: `/pages/${f}`, title, order };
    });

  const entries: PageEntry[] = [];
  const groups = new Map<string, (PageLink & { order: number })[]>();
  for (const p of files) {
    const [group, sub] = p.title.split(" · ");
    if (!sub) {
      entries.push({ href: p.href, title: p.title });
      continue;
    }
    if (!groups.has(group)) {
      groups.set(group, []);
      entries.push({ href: "", title: group, children: [] }); // 占位，保持组第一次出现的位置
    }
    groups.get(group)!.push({ href: p.href, title: sub, order: p.order });
  }
  return entries.map((e) => {
    if (!e.children) return e;
    const kids = groups.get(e.title)!.sort((a, b) => a.order - b.order);
    if (kids.length === 1) return { href: kids[0].href, title: `${e.title} · ${kids[0].title}` };
    return { href: kids[0].href, title: e.title, children: kids.map(({ href, title }) => ({ href, title })) };
  });
}
