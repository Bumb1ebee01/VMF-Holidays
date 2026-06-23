import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "info@vmfholidays.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe@2026";
  const name = process.env.ADMIN_NAME ?? "VMF Admin";
  const passwordHash = await bcrypt.hash(password, 12);

  // Force the admin to a known-good state: correct password, active, ADMIN role.
  const user = await db.user.upsert({
    where: { email },
    update: { passwordHash, active: true, role: "ADMIN" },
    create: { email, name, passwordHash, role: "ADMIN" },
  });

  console.log("\n✓ Admin login is ready:");
  console.log(`    Email:    ${user.email}`);
  console.log(`    Password: ${password}`);
  console.log(`    Role:     ${user.role}   Active: ${user.active}\n`);

  const all = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { email: true, name: true, role: true, active: true },
  });
  console.log(`All users in the database (${all.length}):`);
  for (const u of all) {
    console.log(`  - ${u.email}  ·  ${u.role}  ·  ${u.active ? "active" : "INACTIVE"}  ·  ${u.name}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("reset-admin failed:", e);
    process.exit(1);
  });
