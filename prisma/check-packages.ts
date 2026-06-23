import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const rows = await db.package.findMany({
    orderBy: [{ destinationSlug: "asc" }, { title: "asc" }],
    select: { slug: true, title: true, destination: true, destinationSlug: true, category: true },
  });

  console.log(`\n${rows.length} packages in the database:\n`);
  for (const r of rows) {
    const mismatch =
      r.destination &&
      r.destinationSlug &&
      !r.destination.toLowerCase().includes(r.destinationSlug.toLowerCase()) &&
      !r.destinationSlug.toLowerCase().includes(r.destination.toLowerCase().split(/\s|,/)[0]);
    console.log(
      `  ${mismatch ? "⚠️ " : "   "}[${r.destinationSlug}]  ${r.title}` +
        `   ·   destination="${r.destination}"   ·   slug=${r.slug}`
    );
  }
  console.log("\n⚠️ = the displayed destination name doesn't match its destinationSlug (likely mis-tagged).\n");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("check-packages failed:", e);
    process.exit(1);
  });
