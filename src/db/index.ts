import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelSql } from "@vercel/postgres";
import * as schema from "./schema";

const normalize = (value?: string | null) =>
  value && value !== "undefined" ? value : undefined;

const isLocalConnection = (value: string) =>
  value.includes("localhost") || value.includes("127.0.0.1");

const isPooledConnection = (value: string) => value.includes("-pooler.");

const ensurePooledConnectionString = () => {
  const existing = normalize(process.env.POSTGRES_URL);

  if (existing) {
    if (!isPooledConnection(existing) && !isLocalConnection(existing)) {
      throw new Error(
        "POSTGRES_URL must point to the pooled Vercel Postgres connection string (hostname contains '-pooler.')."
      );
    }
    return existing;
  }

  const fallback = normalize(process.env.DATABASE_URL);
  if (fallback && (isPooledConnection(fallback) || isLocalConnection(fallback))) {
    process.env.POSTGRES_URL = fallback;
    return fallback;
  }

  throw new Error(
    "Missing POSTGRES_URL environment variable. Set it to the pooled Vercel Postgres connection string (with '-pooler.' in the host)."
  );
};

ensurePooledConnectionString();

export const db = drizzle(vercelSql, { schema });
