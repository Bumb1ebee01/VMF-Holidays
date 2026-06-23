"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession, getSessionUserId } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await db.user.findUnique({ where: { email } });
  const valid = user && user.active && (await bcrypt.compare(password, user.passwordHash));
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);
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
