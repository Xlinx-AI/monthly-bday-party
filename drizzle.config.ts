import { defineConfig } from "drizzle-kit";

const normalize = (value?: string | null) =>
  value && value !== "undefined" ? value : undefined;

const connectionString =
  normalize(process.env.POSTGRES_URL_NON_POOLING) ??
  normalize(process.env.POSTGRES_URL) ??
  normalize(process.env.DATABASE_URL);

if (!connectionString) {
  throw new Error(
    "Missing Postgres connection string for Drizzle. " +
      "Set POSTGRES_URL_NON_POOLING (direct), POSTGRES_URL or DATABASE_URL."
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  tablesFilter: ["users", "interests", "user_interests", "events", "event_guests"],
});
