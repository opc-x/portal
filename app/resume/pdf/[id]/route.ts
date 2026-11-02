import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const FILES: Record<string, string> = {
  en: "resume-en.pdf",
  zh: "resume-zh.pdf",
  onsite: "resume-zh-onsite.pdf",
};

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const name = FILES[id];
  if (!name) return new NextResponse("Not found", { status: 404 });
  const data = await readFile(path.join(process.cwd(), "public", name));
  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
