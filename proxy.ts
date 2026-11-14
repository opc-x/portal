import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 首页、/en、/rlist 走老站页面；/resume、/vpn 是独立页面。
// 其它路径在 next.config 的旧 PDF 跳转之后，308 到 /resume。
const PASS = new Set([
  "/",
  "/en",
  "/rlist",
  "/resume",
  "/Michael-Resume-EN-dtcpay-tech-remote.pdf",
  "/michael-256.jpg",
  "/michael-256.webp",
  "/michael-512.jpg",
  "/michael-512.webp",
  "/avatar.png",
  "/favicon.ico",
]);

const PASS_PREFIX = ["/_next/", "/pages/"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    PASS.has(pathname) ||
    PASS_PREFIX.some((p) => pathname.startsWith(p)) ||
    pathname === "/vpn" ||
    pathname.startsWith("/vpn/")
  ) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = "/resume";
  url.search = "";
  return NextResponse.redirect(url, 308);
}
