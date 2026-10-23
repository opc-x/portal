import type { Metadata } from "next";
import Home from "../home";

export const metadata: Metadata = {
  title: "Michael — Senior Java backend engineer",
  description: "Senior Java backend engineer (payments, wallets) and indie maker. Building small, useful things.",
};

export default function Page() {
  return <Home lang="en" />;
}
