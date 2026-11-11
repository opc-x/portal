import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// /resume 用到的地址。其它路径在 next.config 的旧 PDF 跳转之后，308 到 /resume。
const PASS = new Set([
  "/resume",
  "/Michael-Resume-EN-dtcpay-tech-remote.pdf",
  "/michael-256.jpg",
  "/michael-256.webp",
  "/michael-512.jpg",
  "/michael-512.webp",
]);

export function proxy(request: NextRequest) {
  if (PASS.has(request.nextUrl.pathname)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/resume";
  url.search = "";
  return NextResponse.redirect(url, 308);
}
