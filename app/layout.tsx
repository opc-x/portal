import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const display = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-display" });

export const metadata: Metadata = {
  icons: { icon: "/avatar.png", apple: "/avatar.png" },
  title: "Michael C. — Senior Java backend engineer",
  description: "Senior Java backend engineer (payments, wallets) and indie maker. Building small, useful things.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="bg-[#07080a] text-zinc-100 antialiased font-sans">{children}</body>
    </html>
  );
}
