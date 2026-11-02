import type { Metadata } from "next";
import Home from "../home";

export const metadata: Metadata = {
  title: "Michael — Java · Full-stack engineer",
  description: "Java · Full-stack engineer and indie maker. Building small, useful things.",
};

export default function Page() {
  return <Home lang="en" />;
}
