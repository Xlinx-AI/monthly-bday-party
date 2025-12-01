import { drizzle } from "drizzle-orm/vercel-postgres";
import { createClient } from "@vercel/postgres";
import * as schema from "./schema";

const isPrismaUrl = (url: string) => url.includes("prisma.io");

const convertPooledToDirect = (connectionString: string) => {
  try {
    const url = new URL(connectionString);
    const hostname = url.hostname;
    
    // Handle Vercel Postgres pooled URLs (remove -pooler)
    if (hostname.includes("-pooler")) {
        const parts = hostname.split(".");
        const poolerIndex = parts.findIndex(p => p.endsWith("-pooler"));
        if (poolerIndex !== -1) {
            parts[poolerIndex] = parts[poolerIndex].replace("-pooler", "");
            url.hostname = parts.join(".");
            return url.toString();
        }
    }
    return connectionString;
  } catch {
    return connectionString;
  }
};

const getConnectionString = () => {
  // 1. Prefer explicit non-pooling var
  if (process.env.POSTGRES_URL_NON_POOLING) {
    return process.env.POSTGRES_URL_NON_POOLING;
  }

  // 2. Fallback to others, but clean them up
  const candidates = [
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    
    // If it's a Prisma URL, skip it as we can't use it with pg client directly/effectively
    // or it causes the issue we saw.
    if (isPrismaUrl(candidate)) {
        continue;
    }
    
    // If it's a pooled URL, try to convert to direct
    return convertPooledToDirect(candidate);
  }

  // 3. If we only found Prisma URLs or nothing, returns undefined
  return undefined;
};

const connectionString = getConnectionString();

if (!connectionString) {
  throw new Error(
    "Missing valid Postgres connection string. Set POSTGRES_URL_NON_POOLING or POSTGRES_URL (must not be a Prisma URL)."
  );
}

const client = createClient({
  connectionString,
});

try {
    await client.connect();
} catch (err) {
    console.warn("Failed to connect to database during initialization:", err);
    // Continue execution - if this is a build step that doesn't need DB, it might pass.
    // If runtime needs DB, it will fail on query.
}

export const db = drizzle(client, { schema });
