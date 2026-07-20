/**
 * Emergency 2FA recovery — turns two-factor off for one user.
 *
 * For the lost-phone-and-lost-backup-codes case. Deliberately CLI-only: running
 * it needs the DATABASE_URL, so it can't be reached from the web at all.
 *
 *   npm run 2fa:disable -- someone@vmfholidays.com
 *
 * The user can (and should) re-enrol from /admin/security afterwards.
 */

import { config } from "dotenv";
config();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npm run 2fa:disable -- <email>");
    process.exit(1);
  }

  const { db } = await import("../lib/db");

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, totpEnabled: true },
  });

  if (!user) {
    console.error(`No user found with email "${email}".`);
    process.exit(1);
  }

  if (!user.totpEnabled) {
    console.log(`${user.name} <${user.email}> does not have 2FA enabled — nothing to do.`);
    process.exit(0);
  }

  await db.user.update({
    where: { id: user.id },
    data: { totpEnabled: false, totpSecret: null, totpBackupCodes: [] },
  });

  await db.activityLog.create({
    data: {
      userId: user.id,
      userName: user.name,
      action: "user.2fa",
      entity: "User",
      entityId: user.id,
      detail: "Two-factor disabled via emergency recovery script",
    },
  });

  console.log(`✔ 2FA disabled for ${user.name} <${user.email}>.`);
  console.log("  They can sign in with just their password now — ask them to re-enrol");
  console.log("  at /admin/security straight away.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
