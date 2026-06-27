import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "opc-x — Independent Builder",
  description: "一人公司 · 独立产品矩阵 · 精准构建",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
