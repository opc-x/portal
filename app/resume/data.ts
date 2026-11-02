import docs from "./content.json";

type Pair = { lead: string; text: string };
type Point = { lead?: string; text: string };
type Website = { label: string; text: string; href: string };
type Job = {
  company: string;
  href: string;
  role: string;
  dates: string;
  context: string;
  website: Website | null;
  intro: string;
  points: Point[];
};
type Project = { name: string; href: string; text: string; url: string };
type Edu = { school: string; detail: string; dates: string };
type Section = {
  id: string;
  heading: string;
  paragraphs?: string[];
  pairs?: Pair[];
  jobs?: Job[];
  projects?: Project[];
  items?: Edu[];
};
export type ResumeDoc = {
  id: "en" | "zh" | "onsite";
  lang: "en" | "zh";
  htmlLang: string;
  title: string;
  description: string;
  name: string;
  tagline: string;
  availability: string;
  home: { href: string; label: string };
  pdf: string;
  download: string;
  downloadLabel: string;
  fileName: string;
  contacts: { label: string; text: string; href: string }[];
  sections: Section[];
};

export const RESUMES = docs as unknown as ResumeDoc[];

export function resumeById(id: ResumeDoc["id"]) {
  const doc = RESUMES.find((d) => d.id === id);
  if (!doc) throw new Error(`missing resume ${id}`);
  return doc;
}
