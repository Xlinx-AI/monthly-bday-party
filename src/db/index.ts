import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelSql } from "@vercel/postgres";
import * as schema from "./schema";

const normalize = (value?: string | null) =>
  value && value !== "undefined" ? value : undefined;

const isLocalConnection = (value: string) =>
  value.includes("localhost") || value.includes("127.0.0.1");

const isPooledConnection = (value: string) => value.includes("-pooler.");

const convertDirectToPooled = (connectionString: string) => {
  try {
    const url = new URL(connectionString);
    const hostname = url.hostname;

    const match = hostname.match(/^(.*?)(\.postgres\.vercel-storage\.com)$/);
    if (!match) {
      return undefined;
    }

    const [_, prefix, suffix] = match;
    if (!prefix || prefix.endsWith("-pooler")) {
      return undefined;
    }

    url.hostname = `${prefix}-pooler${suffix}`;
    return url.toString();
  } catch {
    return undefined;
  }
};

const resolveConnectionString = () => {
  const candidates = [
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.DATABASE_URL,
  ];

  const raw = candidates.map(normalize).find(Boolean);

  if (!raw) {
    throw new Error(
      "Missing Postgres connection string. Set POSTGRES_URL, POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING, or DATABASE_URL."
    );
  }

  if (isLocalConnection(raw) || isPooledConnection(raw)) {
    return raw;
  }

  const converted = convertDirectToPooled(raw);
  if (converted) {
    console.warn(
      "[12DR] Converted direct Vercel Postgres connection string to pooled variant for serverless runtime."
    );
    return converted;
  }

  throw new Error(
    "Provided Postgres connection string appears to be direct (non-pooled) and could not be converted automatically. " +
      "Please supply the pooled connection string from Vercel (hostname contains '-pooler.')."
  );
};

process.env.POSTGRES_URL = resolveConnectionString();

export const db = drizzle(vercelSql, { schema });
