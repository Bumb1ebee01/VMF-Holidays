"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/user";

export type TeamActionResult = { error: string } | { ok: true };

export async function createUser(_prev: TeamActionResult | null, formData: FormData): Promise<TeamActionResult> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "MEMBER") === "ADMIN" ? "ADMIN" : "MEMBER";

  if (!name || !email) return { error: "Name and email are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "A user with that email already exists." };

  await db.user.create({
    data: { name, email, role, passwordHash: await bcrypt.hash(password, 12) },
  });

  revalidatePath("/admin/team");
  return { ok: true };
}

export async function setUserActive(userId: string, active: boolean): Promise<TeamActionResult> {
  const admin = await requireAdmin();
  if (userId === admin.id) return { error: "You can't deactivate your own account." };

  await db.user.update({ where: { id: userId }, data: { active } });
  revalidatePath("/admin/team");
  return { ok: true };
}

export async function resetUserPassword(userId: string, newPassword: string): Promise<TeamActionResult> {
  await requireAdmin();
  if (newPassword.length < 8) return { error: "Password must be at least 8 characters." };

  await db.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });
  return { ok: true };
}

export async function setUserRole(userId: string, role: string): Promise<TeamActionResult> {
  const admin = await requireAdmin();
  if (userId === admin.id) return { error: "You can't change your own role." };
  const nextRole = role === "ADMIN" ? "ADMIN" : "MEMBER";

  await db.user.update({ where: { id: userId }, data: { role: nextRole } });
  revalidatePath("/admin/team");
  return { ok: true };
}
