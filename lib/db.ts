import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// pg v8+ warns that sslmode=prefer/require/verify-ca are aliased to verify-full
// and will change semantics in pg v9. Make it explicit to preserve behaviour
// (Neon uses a publicly-trusted cert) and silence the warning.
function normalizeSslMode(url?: string) {
  return url?.replace(/sslmode=(prefer|require|verify-ca)\b/i, "sslmode=verify-full");
}

function createClient() {
  // The local `prisma dev` WASM Postgres closes idle sockets aggressively;
  // a tiny idle timeout stops pg from reusing dead connections.
  const isLocalDev = process.env.DATABASE_URL?.includes("127.0.0.1");
  const adapter = new PrismaPg({
    connectionString: normalizeSslMode(process.env.DATABASE_URL),
    max: isLocalDev ? 2 : 10,
    idleTimeoutMillis: isLocalDev ? 100 : 30_000,
  });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
