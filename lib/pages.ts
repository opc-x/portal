import fs from "fs";
import path from "path";

// 子页面：把 HTML 文件放进 public/pages/ 就会出现在首页「写的东西」里。
//   xxx.html     → 中文首页
//   xxx.en.html  → 英文首页
//   _开头的文件  → 不展示（比如 _template.html）
// 列表标题取文件里的 <title>，按文件名排序。
const DIR = path.join(process.cwd(), "public", "pages");

export function listPages(lang: "zh" | "en") {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".html") && !f.startsWith("_"))
    .filter((f) => (lang === "en") === f.endsWith(".en.html"))
    .sort()
    .map((f) => {
      const html = fs.readFileSync(path.join(DIR, f), "utf8");
      const title = html.match(/<title>([^<]*)<\/title>/i)?.[1].trim() || f.replace(/(\.en)?\.html$/, "");
      return { href: `/pages/${f}`, title };
    });
}
