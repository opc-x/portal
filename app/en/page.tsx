import type { Metadata } from "next";
import Home from "../home";

export const metadata: Metadata = {
  title: "Michael",
  description: "Java engineer. Building small, useful tools on the side.",
};

export default function Page() {
  return <Home lang="en" />;
}
