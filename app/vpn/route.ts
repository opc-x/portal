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
    .qr { background: white; border-radius: 1rem; padding: 0.8rem; margin: 1rem 0; }
    .qr svg { display: block; width: 100%; height: auto; }
    code { display: block; overflow-wrap: anywhere; background: #181a1f; border-radius: 0.7rem; padding: 0.8rem; font-size: 0.82rem; }
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
    <h1>扫这个码，三个节点会一起出来。</h1>
    <p>码里是一条地址。Shadowrocket 打开这条地址，拿到的是三台节点，所以列表里会有三台。</p>
    <div class="qr">${svg}</div>
    <p>电脑上的 Clash Verge 用下面这条地址。它拿到的是带自动、手动和站点规则的配置。</p>
    <code>${clash}</code>
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
