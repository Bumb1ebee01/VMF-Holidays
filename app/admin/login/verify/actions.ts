"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSession,
  getTwoFactorPending,
  clearTwoFactorPending,
} from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { isRateLimited } from "@/lib/ratelimit";
import { verifyTotp, decryptSecret } from "@/lib/auth/totp";

export type VerifyState = { error?: string };

const normalize = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export async function verifyTwoFactor(
  _prev: VerifyState,
  formData: FormData
): Promise<VerifyState> {
  const code = String(formData.get("code") ?? "").trim();

  const userId = await getTwoFactorPending();
  if (!userId) {
    redirect("/admin/login?expired=1");
  }

  // A 6-digit code across a ±1-step window is only ~3-in-a-million per guess, so
  // it must be rate limited or it is brute-forceable. Cap per pending user *and*
  // per IP, so neither a shared office IP nor a rotating one lifts the cap.
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip")?.trim() ||
    "unknown";
  if (
    (await isRateLimited(`admin-2fa-user:${userId}`, 8, 900)) ||
    (await isRateLimited(`admin-2fa-ip:${ip}`, 20, 900))
  ) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      active: true,
      sessionVersion: true,
      totpEnabled: true,
      totpSecret: true,
      totpBackupCodes: true,
    },
  });
  if (!user || !user.active) {
    await clearTwoFactorPending();
    redirect("/admin/login");
  }

  let usedBackupCode = false;

  if (user.totpEnabled) {
    const secret = user.totpSecret ? decryptSecret(user.totpSecret) : null;
    let ok = secret ? verifyTotp(secret, code) : false;

    if (!ok) {
      // Backup codes are single-use: the matched hash is dropped on success.
      const entered = normalize(code);
      for (const hash of user.totpBackupCodes) {
        if (await bcrypt.compare(entered, hash)) {
          ok = true;
          usedBackupCode = true;
          await db.user.update({
            where: { id: user.id },
            data: { totpBackupCodes: user.totpBackupCodes.filter((h) => h !== hash) },
          });
          break;
        }
      }
    }

    if (!ok) {
      return { error: "That code isn't right. Check your app and try again." };
    }
  }
  // If 2FA was switched off between the password step and now, the pending
  // ticket still proves the password was correct — sign them in.

  await clearTwoFactorPending();
  await createSession(user.id, user.sessionVersion);
  await logActivity(
    { id: user.id, name: user.name },
    {
      action: "auth.login",
      entity: "Session",
      detail: usedBackupCode
        ? `${user.name} signed in using a 2FA backup code`
        : `${user.name} signed in with two-factor`,
    }
  );
  redirect("/admin");
}

export async function cancelTwoFactor() {
  await clearTwoFactorPending();
  redirect("/admin/login");
}
