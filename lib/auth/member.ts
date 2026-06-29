import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

// Customer ("Travellers Club") sessions. Separate cookie + helpers from the admin
// session so a customer login and a staff login never collide.
export const MEMBER_COOKIE = "vmf_member";
const SESSION_DAYS = 30;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be set to a strong random value (≥16 chars) in production.");
    }
    return new TextEncoder().encode("vmf-dev-secret");
  }
  return new TextEncoder().encode(secret);
}

export async function createMemberSession(memberId: string) {
  const token = await new SignJWT({ sub: memberId, kind: "member" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(MEMBER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
}

export async function destroyMemberSession() {
  const jar = await cookies();
  jar.delete(MEMBER_COOKIE);
}

async function getMemberId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(MEMBER_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export type ClubMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  tier: string;
  creditBalance: number;
  referredById: string | null;
  firstBookingAt: Date | null;
};

export async function getCurrentMember(): Promise<ClubMember | null> {
  const id = await getMemberId();
  if (!id) return null;
  const m = await db.member.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      referralCode: true,
      tier: true,
      creditBalance: true,
      active: true,
      referredById: true,
      firstBookingAt: true,
    },
  });
  if (!m || !m.active) return null;
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    referralCode: m.referralCode,
    tier: m.tier,
    creditBalance: m.creditBalance,
    referredById: m.referredById,
    firstBookingAt: m.firstBookingAt,
  };
}

export async function requireMember(): Promise<ClubMember> {
  const member = await getCurrentMember();
  if (!member) redirect("/travellers-club/login");
  return member;
}
