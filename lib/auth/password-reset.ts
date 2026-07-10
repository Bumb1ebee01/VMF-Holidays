import "server-only";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { APP_URL, SITE_NAME } from "@/lib/seo";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

// The raw token goes in the email link; only its SHA-256 hash is stored, so a DB
// leak can't be used to reset anyone's password. High-entropy token → a fast hash
// (not bcrypt) is fine and keeps lookups indexable.
const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

/**
 * Issue a password-reset link for the given email. Stores the token hash + expiry
 * and emails the link. Deliberately silent when the email isn't a registered/active
 * member — the caller shows the same message either way so accounts can't be probed.
 */
export async function issuePasswordReset(email: string): Promise<void> {
  const member = await db.member.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, active: true },
  });
  if (!member || !member.active) return;

  const token = crypto.randomBytes(32).toString("hex");
  await db.member.update({
    where: { id: member.id },
    data: {
      resetTokenHash: hashToken(token),
      resetTokenExpiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  const link = `${APP_URL}/travellers-club/reset-password?token=${token}`;
  await sendEmail({
    to: member.email,
    subject: `Reset your ${SITE_NAME} password`,
    html: resetEmailHtml(member.name, link),
  });
}

/**
 * Validate a reset token and set the new password. Single-use: the token is cleared
 * on success. Returns a generic error for an invalid/expired token.
 */
export async function completePasswordReset(
  token: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  if (!token) return { ok: false, error: "This reset link is invalid." };
  if (newPassword.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const member = await db.member.findFirst({
    where: {
      resetTokenHash: hashToken(token),
      resetTokenExpiresAt: { gt: new Date() },
    },
    select: { id: true },
  });
  if (!member) {
    return { ok: false, error: "This reset link is invalid or has expired. Please request a new one." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.member.update({
    where: { id: member.id },
    data: { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null },
  });
  return { ok: true };
}

function resetEmailHtml(name: string, link: string): string {
  const safeName = name.replace(/[<>&]/g, "");
  return `<!doctype html><html><body style="margin:0;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#1a1f36">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:14px;overflow:hidden">
        <tr><td style="background:#002464;padding:22px 28px;color:#ffffff;font-size:18px;font-weight:700">VMF Holidays</td></tr>
        <tr><td style="padding:28px">
          <h1 style="margin:0 0 12px;font-size:20px;color:#002464">Reset your password</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6">Hi ${safeName || "there"}, we received a request to reset your Travellers Club password. Click the button below to choose a new one — this link is valid for 1 hour.</p>
          <p style="margin:0 0 24px"><a href="${link}" style="display:inline-block;background:#FE5C10;color:#ffffff;text-decoration:none;font-weight:700;padding:13px 26px;border-radius:10px;font-size:15px">Reset my password</a></p>
          <p style="margin:0 0 8px;font-size:13px;color:#7b8298;line-height:1.6">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="margin:0 0 20px;font-size:13px;word-break:break-all"><a href="${link}" style="color:#002464">${link}</a></p>
          <p style="margin:0;font-size:13px;color:#7b8298;line-height:1.6">Didn't request this? You can safely ignore this email — your password won't change.</p>
        </td></tr>
        <tr><td style="padding:18px 28px;background:#f4f1ea;font-size:12px;color:#7b8298">VMF Holidays Pvt. Ltd. · Nagoa, Bardez, Goa</td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}
