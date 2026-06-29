"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createMemberSession, destroyMemberSession } from "@/lib/auth/member";
import { generateReferralCode } from "@/lib/referral";

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
  const refCode = String(formData.get("ref") ?? "").trim().toUpperCase().slice(0, 32);

  if (!name || !email || !phone || !password) return { error: "Please fill in every field." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (phone.replace(/\D/g, "").length < 6) return { error: "Please enter a valid phone number." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await db.member.findFirst({
    where: { OR: [{ email }, { phone }] },
    select: { id: true },
  });
  if (existing) return { error: "An account with this email or phone already exists — try logging in." };

  // Resolve the referrer from the code (ignore unknown codes; self-referral is
  // impossible here since the new member has no code yet).
  let referredById: string | null = null;
  if (refCode) {
    const referrer = await db.member.findUnique({
      where: { referralCode: refCode },
      select: { id: true },
    });
    if (referrer) referredById = referrer.id;
  }

  // Generate a unique referral code (retry on the rare collision).
  let code = generateReferralCode(name);
  for (let i = 0; i < 5; i += 1) {
    const clash = await db.member.findUnique({ where: { referralCode: code }, select: { id: true } });
    if (!clash) break;
    code = generateReferralCode(name);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const member = await db.member.create({
    data: { name, email, phone, passwordHash, referralCode: code, referredById },
    select: { id: true },
  });

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

  await db.member.update({ where: { id: member.id }, data: { lastLoginAt: new Date() } });
  await createMemberSession(member.id);
  redirect("/travellers-club/dashboard");
}

export async function logoutMember() {
  await destroyMemberSession();
  redirect("/travellers-club");
}
