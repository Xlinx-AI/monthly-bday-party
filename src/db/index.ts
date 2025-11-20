import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelSql } from "@vercel/postgres";
import * as schema from "./schema";

const fallbackConnectionString = [
  process.env.POSTGRES_PRISMA_URL,
  process.env.DATABASE_URL,
].find((value) => value && value !== "undefined");

if (!process.env.POSTGRES_URL && fallbackConnectionString) {
  process.env.POSTGRES_URL = fallbackConnectionString;
}

export const db = drizzle(vercelSql, { schema });
