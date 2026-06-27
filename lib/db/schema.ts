import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Placeholder schema — add tables here as the product grows.
export const pages = pgTable("pages", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
