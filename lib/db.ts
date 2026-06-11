import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  // The local `prisma dev` WASM Postgres closes idle sockets aggressively;
  // a tiny idle timeout stops pg from reusing dead connections.
  const isLocalDev = process.env.DATABASE_URL?.includes("127.0.0.1");
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    max: isLocalDev ? 2 : 10,
    idleTimeoutMillis: isLocalDev ? 100 : 30_000,
  });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
