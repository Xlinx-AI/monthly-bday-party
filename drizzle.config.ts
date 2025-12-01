import { defineConfig } from "drizzle-kit";

const normalize = (value?: string | null) =>
  value && value !== "undefined" ? value : undefined;

const isPrismaUrl = (url: string) => url.includes("prisma.io");

const getConnectionString = () => {
    const direct = normalize(process.env.POSTGRES_URL_NON_POOLING);
    if (direct) return direct;

    const candidates = [
        normalize(process.env.POSTGRES_URL),
        normalize(process.env.DATABASE_URL)
    ];

    for (const candidate of candidates) {
        if (candidate && !isPrismaUrl(candidate)) {
            return candidate;
        }
    }
    
    return undefined;
};

const connectionString = getConnectionString();

if (!connectionString) {
  throw new Error(
    "Missing valid Postgres connection string for Drizzle. " +
      "Set POSTGRES_URL_NON_POOLING (direct), POSTGRES_URL or DATABASE_URL (must not be a Prisma URL)."
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
