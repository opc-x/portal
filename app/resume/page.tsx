import type { Metadata } from "next";
import ResumeView from "./view";
import { resumeById } from "./data";

const doc = resumeById("en");

export const metadata: Metadata = {
  title: doc.title,
  description: doc.description,
};

export default function Page() {
  return <ResumeView doc={doc} />;
}
