import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import shared from "@/components/admin/shared.module.css";
import TwoFactorPanel from "./TwoFactorPanel";

export const metadata: Metadata = { title: "Security" };
export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const me = await requireUser();
  const user = await db.user.findUnique({
    where: { id: me.id },
    select: { totpEnabled: true, totpBackupCodes: true },
  });

  return (
    <>
      <div className={shared.pageHeader}>
        <p className={shared.kicker}>Your account</p>
        <h1 className={shared.pageTitle}>Security</h1>
        <p className={shared.pageSub}>
          Settings that protect your own sign-in. These apply to {me.email} only — they don&apos;t
          change anything for the rest of the team.
        </p>
      </div>

      <TwoFactorPanel
        enabled={user?.totpEnabled ?? false}
        remainingBackupCodes={user?.totpBackupCodes.length ?? 0}
      />
    </>
  );
}
