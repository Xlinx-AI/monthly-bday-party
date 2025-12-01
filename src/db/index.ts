import { drizzle } from "drizzle-orm/vercel-postgres";
import { createClient } from "@vercel/postgres";
import * as schema from "./schema";

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing Postgres connection string. Set POSTGRES_URL_NON_POOLING, POSTGRES_URL or DATABASE_URL."
  );
}

const client = createClient({
  connectionString,
});

await client.connect();

export const db = drizzle(client, { schema });
