"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSession,
  destroySession,
  getSessionUserId,
  createTwoFactorPending,
} from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { isRateLimited } from "@/lib/ratelimit";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Brute-force guard: cap admin login attempts per IP (shared Upstash limiter
  // when configured, else in-memory). Counts every attempt in the window.
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip")?.trim() ||
    "unknown";
  if (await isRateLimited(`admin-login:${ip}`, 10, 900)) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const user = await db.user.findUnique({ where: { email } });
  const valid = user && user.active && (await bcrypt.compare(password, user.passwordHash));
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  // Password is correct but it isn't a session yet: users with 2FA on get a
  // short-lived pending ticket and must clear the second step first.
  if (user.totpEnabled) {
    await createTwoFactorPending(user.id);
    redirect("/admin/login/verify");
  }

  await createSession(user.id, user.sessionVersion);
  await logActivity(
    { id: user.id, name: user.name },
    { action: "auth.login", entity: "Session", detail: `${user.name} signed in` }
  );
  redirect("/admin");
}

export async function logout() {
  const userId = await getSessionUserId();
  if (userId) {
    const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, name: true } });
    if (user) {
      await logActivity(user, { action: "auth.logout", entity: "Session", detail: `${user.name} signed out` });
    }
  }
  await destroySession();
  redirect("/admin/login");
}
