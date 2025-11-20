# Vercel Postgres Setup Guide for 12DR

## Understanding Vercel Postgres Connection Types

Vercel Postgres provides **two types of connection strings**:

### 1. Pooled Connection (for Serverless)
- **URL Pattern:** `postgres://user:pass@xxx-pooler.postgres.vercel-storage.com/db`
- **Identifier:** Contains `-pooler.` in the hostname
- **Use Case:** Next.js API routes, Edge functions, serverless environments
- **Environment Variable:** `POSTGRES_URL`
- **Required for:** 12DR application runtime

### 2. Direct Connection (for Migrations)
- **URL Pattern:** `postgres://user:pass@xxx.postgres.vercel-storage.com/db`
- **Identifier:** Does NOT contain `-pooler.` in the hostname
- **Use Case:** Database migrations, seeding, long-running processes
- **Environment Variables:** `POSTGRES_URL_NON_POOLING` or `POSTGRES_PRISMA_URL`
- **Required for:** Optional - improves migration performance

---

## Setup Instructions

### Option A: Standard Vercel Postgres

1. **Create Postgres Database in Vercel Dashboard**
   - Go to [dashboard.vercel.com](https://dashboard.vercel.com)
   - Navigate to **Storage** → **Create Database** → **Postgres**
   - Choose your region and create the database

2. **Copy Connection Strings**
   
   In the Vercel dashboard, you'll see:
   ```bash
   POSTGRES_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com/verceldb?sslmode=require"
   POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.postgres.vercel-storage.com/verceldb?sslmode=require"
   ```

3. **Configure Your `.env.local`**
   ```bash
   # Required: Pooled connection for app runtime
   POSTGRES_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com/verceldb?sslmode=require"
   
   # Optional: Direct connection for faster migrations
   POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.postgres.vercel-storage.com/verceldb?sslmode=require"
   ```

### Option B: Vercel Prisma Postgres

If you created your database using Vercel's Prisma integration, you'll have these variables:

1. **Connection Strings from Vercel**
   ```bash
   POSTGRES_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_PRISMA_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
   POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
   ```

2. **Configure Your `.env.local`**
   ```bash
   # Use the pooled URL for app runtime
   POSTGRES_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb"
   
   # Use POSTGRES_PRISMA_URL for migrations (also pooled but with pgbouncer params)
   POSTGRES_PRISMA_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
   ```

   **Note:** Even though `POSTGRES_PRISMA_URL` contains pgbouncer parameters, it's still a **pooled connection** (notice `-pooler.` in the hostname). This works perfectly with 12DR.

---

## How 12DR Uses These Connection Strings

### Application Runtime (`src/db/index.ts`)

The application validates and uses `POSTGRES_URL`:

```typescript
// ✅ Valid: Pooled connection
POSTGRES_URL="postgres://xxx@xxx-pooler.postgres.vercel-storage.com/db"

// ✅ Valid: Localhost (for development)
POSTGRES_URL="postgres://localhost:5432/twelvedr"

// ❌ Invalid: Direct connection
POSTGRES_URL="postgres://xxx@xxx.postgres.vercel-storage.com/db"
```

**Validation Logic:**
- Checks if `POSTGRES_URL` contains `-pooler.` in the hostname
- Allows localhost connections for local development
- Throws clear error if a direct connection string is detected

### Database Migrations (`drizzle.config.ts`)

The migration tool prefers direct connections but falls back gracefully:

```typescript
// Priority order:
1. POSTGRES_URL_NON_POOLING  // Best for migrations
2. POSTGRES_PRISMA_URL        // Works well
3. POSTGRES_URL               // Also works
4. DATABASE_URL               // Fallback
```

---

## Common Scenarios

### Scenario 1: Fresh Vercel Postgres Setup

```bash
# .env.local
POSTGRES_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com/verceldb?sslmode=require"
JWT_SECRET="your-secret-key"
YOOKASSA_SHOP_ID="123456"
YOOKASSA_SECRET_KEY="test_yookassa_secret_key"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
TWELVEDR_ENABLE_PAYMENT_MOCKS=true
```

Run migrations:
```bash
npm run db:migrate
```

### Scenario 2: Prisma Postgres with Separate Migration URL

```bash
# .env.local
POSTGRES_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb"
POSTGRES_PRISMA_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
JWT_SECRET="your-secret-key"
# ... other vars
```

Run migrations:
```bash
npm run db:migrate
```

Drizzle will automatically use `POSTGRES_URL_NON_POOLING` for migrations (faster), and the app will use `POSTGRES_URL` for runtime.

### Scenario 3: Local Development

```bash
# .env.local
POSTGRES_URL="postgres://postgres:password@localhost:5432/twelvedr_dev"
JWT_SECRET="local-dev-secret"
# ... other vars
```

Localhost connections bypass the pooled connection validation.

---

## Troubleshooting

### Error: "invalid_connection_string"

**Full Error:**
```
VercelPostgresError - 'invalid_connection_string': This connection string is meant 
to be used with a direct connection. Make sure to use a pooled connection string 
or try `createClient()` instead.
```

**Solution:**
Check that your `POSTGRES_URL` contains `-pooler.` in the hostname:

```bash
# ❌ Wrong (direct connection)
POSTGRES_URL="postgres://default:xxx@ep-xyz123.us-east-1.postgres.vercel-storage.com/verceldb"

# ✅ Correct (pooled connection)
POSTGRES_URL="postgres://default:xxx@ep-xyz123-pooler.us-east-1.postgres.vercel-storage.com/verceldb"
```

### Error: "Missing POSTGRES_URL environment variable"

**Solution:**
Ensure `POSTGRES_URL` is defined in your `.env.local`:

```bash
# Copy from Vercel Dashboard
POSTGRES_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com/verceldb"
```

### Using Vercel CLI to Pull Environment Variables

If your project is already linked to Vercel:

```bash
# Link project (if not already linked)
vercel link

# Pull environment variables
vercel env pull .env.local
```

This will automatically populate your `.env.local` with the correct connection strings from Vercel.

---

## Why Pooled Connections?

Serverless environments (like Vercel) create new function instances for each request. Without connection pooling:
- Each request opens a new database connection
- Connections aren't reused
- Database connection limits are quickly exhausted
- Performance degrades

**Pooled connections solve this by:**
- Reusing existing connections across requests
- Managing connection lifecycle automatically
- Preventing connection exhaustion
- Improving performance in serverless environments

---

## Summary

**For 12DR to work correctly:**

1. ✅ `POSTGRES_URL` must be a **pooled** connection string (contains `-pooler.`)
2. ✅ Optionally provide `POSTGRES_URL_NON_POOLING` or `POSTGRES_PRISMA_URL` for migrations
3. ✅ The app validates connection strings at startup
4. ✅ Clear error messages guide you to fix configuration issues

**Quick Check:**
```bash
# Correct POSTGRES_URL should contain:
xxx-pooler.postgres.vercel-storage.com
         ^^^^^^^ This part is required!
```
