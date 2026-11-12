import { NextResponse } from "next/server";
import qrcode from "../../lib/qrcode.js";
import { pickLinks, pickYaml } from "../../lib/vpn-entries.js";
import { gateMatches, gateValue, sameSecret } from "../../lib/vpn";

export const dynamic = "force-dynamic";

const COOKIE = "vpn_gate";

function page(body: string, status = 200) {
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>四个入口</title>
  <style>
    body { margin: 0; background: #101114; color: #f4f1ea; font: 17px/1.5 -apple-system, BlinkMacSystemFont, sans-serif; }
    main { max-width: 26rem; margin: 0 auto; padding: 2.5rem 1.25rem 3rem; }
    h1 { font-size: 1.7rem; line-height: 1.25; margin: 0 0 0.8rem; }
    h2 { font-size: 1.2rem; line-height: 1.3; margin: 0 0 0.4rem; }
    h3 { font-size: 0.95rem; line-height: 1.3; margin: 0.95rem 0 0.3rem; }
    p { margin: 0 0 0.75rem; }
    form { display: grid; gap: 0.75rem; margin-top: 1.2rem; }
    input { font: inherit; padding: 0.8rem 0.9rem; border-radius: 0.7rem; border: 1px solid #3a3d44; background: #181a1f; color: inherit; }
    button { font: inherit; border: 0; border-radius: 0.7rem; background: #f4f1ea; color: #17181c; padding: 0.8rem 0.9rem; text-align: center; }
    .bad { color: #ffb4a8; }
    article { border: 1px solid #34373e; border-radius: 1rem; padding: 1rem 1rem 0.3rem; margin: 0 0 1rem; }
    .qr { background: white; border-radius: 1rem; padding: 0.8rem; margin: 0.4rem 0 0.8rem; }
    .qr svg { display: block; width: 100%; height: auto; }
    .row { display: flex; gap: 0.5rem; align-items: stretch; margin: 0 0 0.75rem; }
    .row code { flex: 1; }
    .row button { width: auto; white-space: nowrap; }
    code, pre { display: block; overflow-wrap: anywhere; background: #181a1f; border-radius: 0.7rem; padding: 0.8rem; font-size: 0.78rem; margin: 0; }
    pre { white-space: pre-wrap; max-height: 16rem; overflow: auto; margin-bottom: 0.55rem; }
    details { margin: 0.2rem 0 0.6rem; }
    summary { font-weight: 650; padding: 0.7rem 0; cursor: pointer; }
    section { margin-top: 0.4rem; }
  </style>
</head>
<body><main>${body}</main>
<script>
  document.querySelectorAll("[data-copy], [data-copy-for]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = btn.getAttribute("data-copy-for");
      const node = target ? document.getElementById(target) : null;
      const text = node ? node.textContent || "" : btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        const area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
      }
      btn.textContent = "已复制";
    });
  });
</script>
</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function login(wrong: boolean) {
  return page(`
    <h1>先输入页面密码。</h1>
    <p>密码只开这一页。手机上的软件不会填这个表单，它要扫这一页里的码。</p>
    ${wrong ? '<p class="bad">密码不对。</p>' : ""}
    <form method="post">
      <input name="password" type="password" autocomplete="current-password" autofocus required>
      <button type="submit">进入</button>
    </form>
  `, wrong ? 401 : 200);
}

function originOf(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") || url.host;
  const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function linkRow(url: string) {
  const safe = esc(url);
  return `<div class="row"><code>${safe}</code><button type="button" data-copy="${safe}">复制</button></div>`;
}

function rawBlock(id: string, label: string, note: string, text: string) {
  const body = text.trim();
  if (!body) return `<h3>${esc(label)}</h3><p>这条原文还没配上。</p>`;
  return `
    <h3>${esc(label)}</h3>
    <p>${esc(note)}</p>
    <pre id="${id}">${esc(body)}</pre>
    <button type="button" data-copy-for="${id}">复制</button>
  `;
}

function entryCard(
  origin: string,
  token: string,
  node: string,
  title: string,
  detail: string,
  links: string,
  yaml: string,
) {
  const query = `t=${encodeURIComponent(token)}${node ? `&node=${node}` : ""}`;
  const rocket = `${origin}/vpn/sub?${query}&client=rocket`;
  const clash = `${origin}/vpn/sub?${query}&client=clash`;
  const key = node || "all";
  const qr = qrcode(0, "M");
  qr.addData(rocket);
  qr.make();
  const svg = qr.createSvgTag({ cellSize: 4, margin: 8, scalable: true });
  return `
    <article>
      <h2>${esc(title)}</h2>
      <p>${esc(detail)}</p>
      <h3>手机</h3>
      <p>扫这个码，或者复制下面这条。回来的是节点。</p>
      <div class="qr">${svg}</div>
      ${linkRow(rocket)}
      <h3>电脑</h3>
      <p>复制这一条。回来的是带自动、手选的配置。默认全走代理。</p>
      ${linkRow(clash)}
      <details>
        <summary>备用原文</summary>
        ${rawBlock(`${key}-links`, "节点", "以 vless 开头。域名挂了，把这一段直接交给手机软件。", links)}
        ${rawBlock(`${key}-yaml`, "配置", "这是电脑那条地址回来的正文。域名挂了，把这一段直接导入电脑。", yaml)}
      </details>
    </article>
  `;
}

function panel(request: Request) {
  const token = process.env.VPN_SUB_TOKEN || "";
  const origin = originOf(request);
  const storedLinks = process.env.VPN_NODE_LINKS || "";
  const storedYaml = process.env.VPN_CLASH_YAML || "";
  const entries = [
    ["", "Jailbreak", "三台合在一份里。自动会在三台之间挑。"],
    ["tyo", "VPSTaxi-JP-TYO", "只有东京。配方一样，自动只能选这一台。"],
    ["ca", "RackNerd-US-CA", "只有加州。配方一样，自动只能选这一台。"],
    ["nyc", "LocLix-US-NYC", "只有纽约。配方一样，自动只能选这一台。"],
  ] as const;
  const cards = entries
    .map(([node, title, detail]) =>
      entryCard(
        origin,
        token,
        node,
        title,
        detail,
        pickLinks(storedLinks, node),
        pickYaml(storedYaml, node),
      ),
    )
    .join("");
  return page(`
    <h1>先用链接，原文收在卡片里。</h1>
    <p>每张卡片上面是怎么用。点开「备用原文」，才是这条订阅背后的节点和配置。四条都在这个域名上，域名挂了就一起挂，那时用原文。</p>
    ${cards}
    <section>
      <h2>分流</h2>
      <h3>自动</h3>
      <p>每 300 秒比一次谁先打开 gstatic 的小页面，慢的要比快的多出 50 毫秒才换。三台那份按 11 月 12 日测的延迟，多半选东京。单独那三份只有一台，自动也是这一台。内核认过这个写法，没有长时间盯着它自动来回切。</p>
      <h3>手动</h3>
      <p>在「选择」里点某一台的名字。单独那三份只能点自己或直连。</p>
      <h3>默认全走代理</h3>
      <p>只有本机私网地址直连。其余进 Clash 的连接都走「选择」里当前那台，不再按中国网站名单或中国 IP 直连。GeoIP 把部分境外站判成中国 IP 时，以前会误直连；现在这条路关掉了。</p>
      <p>这份配置管的是进了 Clash 的连接。三台还在、密钥没变，就可以一直用。手机那条没有这段分流，它只有节点。</p>
    </section>
  `);
}

function cookieHeader(request: Request) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === COOKIE) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export async function GET(request: Request) {
  const password = process.env.VPN_PAGE_PASSWORD || "";
  if (!password || !process.env.VPN_SUB_TOKEN) return page("<h1>这一页还没配好。</h1>", 503);
  if (!gateMatches(cookieHeader(request), password)) return login(false);
  return panel(request);
}

export async function POST(request: Request) {
  const password = process.env.VPN_PAGE_PASSWORD || "";
  const form = await request.formData();
  const given = String(form.get("password") || "");
  if (!sameSecret(given, password)) return login(true);
  const response = NextResponse.redirect(new URL("/vpn", originOf(request)), 303);
  response.cookies.set(COOKIE, gateValue(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/vpn",
    maxAge: 60 * 60 * 24 * 30,
  });
  response.headers.set("cache-control", "no-store");
  return response;
}
