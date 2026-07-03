"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createMemberSession, destroyMemberSession } from "@/lib/auth/member";
import { JOIN_BONUS, REF_COOKIE, normalizeCode, referrerLabel, generateReferralCode } from "@/lib/referral";
import { upsertReferralStage } from "@/lib/referral-credit";

export type ClubFormState = { error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sign up a new Travellers Club member, attributing the referrer if a code is present. */
export async function joinClub(_prev: ClubFormState, formData: FormData): Promise<ClubFormState> {
  // Honeypot — a hidden field bots fill; real users never see it.
  if (String(formData.get("company") ?? "").trim()) {
    return { error: "Something went wrong. Please try again." };
  }

  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 25);
  const password = String(formData.get("password") ?? "");
  const typedCode = normalizeCode(String(formData.get("ref") ?? ""));

  if (!name || !email || !phone || !password) return { error: "Please fill in every field." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (phone.replace(/\D/g, "").length < 6) return { error: "Please enter a valid phone number." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await db.member.findFirst({
    where: { OR: [{ email }, { phone }] },
    select: { id: true },
  });
  if (existing) return { error: "An account with this email or phone already exists — try logging in." };

  // Resolve the referrer. First-touch cookie wins; a typed code (WI-15) is only a
  // fallback when there's no cookie, so a genuine link referral is never overwritten.
  const jar = await cookies();
  const cookieCode = normalizeCode(jar.get(REF_COOKIE)?.value ?? "");
  const chosenCode = cookieCode || typedCode;
  let referredById: string | null = null;
  if (chosenCode) {
    const referrer = await db.member.findUnique({
      where: { referralCode: chosenCode },
      select: { id: true, phone: true, email: true },
    });
    // Reject self-referral: the code must not resolve to this same person.
    if (referrer && referrer.phone !== phone && referrer.email !== email) referredById = referrer.id;
  }

  // Generate a unique referral code (retry on the rare collision).
  let code = generateReferralCode(name);
  for (let i = 0; i < 5; i += 1) {
    const clash = await db.member.findUnique({ where: { referralCode: code }, select: { id: true } });
    if (!clash) break;
    code = generateReferralCode(name);
  }

  // Create the member with their ₹250 join bonus written to the ledger in the same
  // transaction (WI-5), so a new member always starts with a correct balance.
  const passwordHash = await bcrypt.hash(password, 10);
  const member = await db.$transaction(async (tx) => {
    const m = await tx.member.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        referralCode: code,
        referredById,
        creditBalance: JOIN_BONUS,
        lastActivityAt: new Date(),
      },
      select: { id: true },
    });
    await tx.creditEntry.create({
      data: {
        memberId: m.id,
        amount: JOIN_BONUS,
        reason: "JOIN_BONUS",
        note: "Welcome to the Travellers Club",
        approvedBy: "SYSTEM_AUTO",
      },
    });
    return m;
  });

  // Link the referral (marks the friend as "Joined") and consume the first-touch
  // cookie. Attribution is best-effort — it must never block a successful signup.
  if (referredById) {
    try {
      await upsertReferralStage({
        referrerId: referredById,
        refereeMemberId: member.id,
        refereeName: name,
        refereePhone: phone,
        status: "PENDING",
      });
    } catch (err) {
      console.error("[joinClub] referral link failed:", err);
    }
  }
  jar.delete(REF_COOKIE);

  await createMemberSession(member.id);
  redirect("/travellers-club/dashboard");
}

/** Log an existing member in. */
export async function loginMember(_prev: ClubFormState, formData: FormData): Promise<ClubFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  const member = await db.member.findUnique({ where: { email } });
  const valid = member && member.active && (await bcrypt.compare(password, member.passwordHash));
  if (!valid) return { error: "Invalid email or password." };

  await db.member.update({
    where: { id: member.id },
    data: { lastLoginAt: new Date(), lastActivityAt: new Date() },
  });
  await createMemberSession(member.id);
  redirect("/travellers-club/dashboard");
}

export async function logoutMember() {
  await destroyMemberSession();
  redirect("/travellers-club");
}

/** Live validation for the WI-15 referral-code field — returns a masked referrer label. */
export type RefCheck = { ok: boolean; label?: string };

export async function checkReferralCode(code: string): Promise<RefCheck> {
  const c = normalizeCode(code);
  if (!c) return { ok: false };
  const m = await db.member.findUnique({ where: { referralCode: c }, select: { name: true } });
  return m ? { ok: true, label: referrerLabel(m.name) } : { ok: false };
}
