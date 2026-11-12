import { NextResponse } from "next/server";
import qrcode from "../../lib/qrcode.js";
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
  <title>三个节点</title>
  <style>
    body { margin: 0; background: #101114; color: #f4f1ea; font: 17px/1.5 -apple-system, BlinkMacSystemFont, sans-serif; }
    main { max-width: 26rem; margin: 0 auto; padding: 2.5rem 1.25rem 3rem; }
    h1 { font-size: 1.7rem; line-height: 1.25; margin: 0 0 0.8rem; }
    p { margin: 0 0 0.9rem; }
    form { display: grid; gap: 0.75rem; margin-top: 1.2rem; }
    input { font: inherit; padding: 0.8rem 0.9rem; border-radius: 0.7rem; border: 1px solid #3a3d44; background: #181a1f; color: inherit; }
    button, .link { font: inherit; border: 0; border-radius: 0.7rem; background: #f4f1ea; color: #17181c; padding: 0.8rem 0.9rem; text-align: center; }
    .bad { color: #ffb4a8; }
    h2 { font-size: 1.15rem; line-height: 1.3; margin: 1.5rem 0 0.55rem; }
    .qr { background: white; border-radius: 1rem; padding: 0.8rem; margin: 1rem 0; }
    .qr svg { display: block; width: 100%; height: auto; }
    .row { display: flex; gap: 0.5rem; align-items: stretch; margin: 0 0 0.9rem; }
    .row code { flex: 1; }
    .row button { width: auto; white-space: nowrap; }
    code { display: block; overflow-wrap: anywhere; background: #181a1f; border-radius: 0.7rem; padding: 0.8rem; font-size: 0.82rem; margin: 0; }
  </style>
</head>
<body><main>${body}</main></body>
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

async function panel(request: Request) {
  const token = process.env.VPN_SUB_TOKEN || "";
  const origin = originOf(request);
  const rocket = `${origin}/vpn/sub?t=${encodeURIComponent(token)}&client=rocket`;
  const clash = `${origin}/vpn/sub?t=${encodeURIComponent(token)}&client=clash`;
  const qr = qrcode(0, "M");
  qr.addData(rocket);
  qr.make();
  const svg = qr.createSvgTag({ cellSize: 4, margin: 8, scalable: true });
  return page(`
    <h1>这个码是第一条地址的图。</h1>
    <p>图里只有一条地址。Shadowrocket 打开它，回来的是三台节点，所以一次列出三台。第二条地址才回来那份带规则的配置，两条不是同一份东西。</p>
    <div class="qr">${svg}</div>
    <h2>手机扫的是这一条</h2>
    ${linkRow(rocket)}
    <h2>电脑用的是这一条</h2>
    ${linkRow(clash)}
    <h2>分流就这三条</h2>
    <p>自动每 300 秒比一次谁先打开 gstatic 的小页面，慢的要比快的多出 50 毫秒才换。按 11 月 12 日测的延迟，多半选东京。内核认过这个写法，没有长时间盯着它自动来回切。</p>
    <p>手动就是在「选择」里点某一台的名字。</p>
    <p>中国网站名单和中国 IP 直连。大陆的站绕到东京或美国再回来，路更长，所以更慢。没进名单的站仍然走代理。这条没有单独拿大陆网站计时。</p>
    <p>这份配置管的是进了 Clash 的连接。三台还在、密钥没变，就可以一直用。Clash 没在用这份，它不管。</p>
    <script>
      document.querySelectorAll("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const text = btn.getAttribute("data-copy") || "";
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
