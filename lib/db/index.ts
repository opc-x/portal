import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Use DATABASE_URL_UNPOOLED (direct endpoint) — Vercel sets this via Neon integration.
// Pooler URL is empty in production; direct endpoint works with neon() HTTP driver.
// Strip query params: channel_binding=require breaks HTTP fetch URL construction.
const raw = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!;
const sql = neon(raw.split("?")[0]);
export const db = drizzle(sql, { schema });
