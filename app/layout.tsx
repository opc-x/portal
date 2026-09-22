import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Michael",
  description: "Java 工程师，业余做点小工具。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
