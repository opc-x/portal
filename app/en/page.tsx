import type { Metadata } from "next";
import Home from "../home";

export const metadata: Metadata = {
  title: "Michael — Java backend engineer",
  description: "Java backend engineer (payments, wallets) and indie maker. Building small, useful things.",
};

export default function Page() {
  return <Home lang="en" />;
}
