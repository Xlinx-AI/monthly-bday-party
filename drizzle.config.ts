import { defineConfig } from "drizzle-kit";

const connectionString = [
  process.env.POSTGRES_URL,
  process.env.POSTGRES_PRISMA_URL,
  process.env.DATABASE_URL,
].find((value) => value && value !== "undefined");

if (!connectionString) {
  throw new Error(
    "Missing Postgres connection string for Drizzle. " +
      "Set POSTGRES_URL, POSTGRES_PRISMA_URL, or DATABASE_URL."
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
