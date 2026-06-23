"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { DEFAULT_MEMBER_PERMISSIONS, sanitizePermissions } from "@/lib/permissions";

export type TeamActionResult = { error: string } | { ok: true };

export async function createUser(_prev: TeamActionResult | null, formData: FormData): Promise<TeamActionResult> {
  const admin = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "MEMBER") === "ADMIN" ? "ADMIN" : "MEMBER";

  if (!name || !email) return { error: "Name and email are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { error: "A user with that email already exists." };

  const created = await db.user.create({
    data: {
      name,
      email,
      role,
      passwordHash: await bcrypt.hash(password, 12),
      permissions: role === "MEMBER" ? DEFAULT_MEMBER_PERMISSIONS : [],
    },
  });

  await logActivity(admin, {
    action: "user.create",
    entity: "User",
    entityId: created.id,
    detail: `Added ${name} as ${role === "ADMIN" ? "Admin" : "Member"}`,
  });

  revalidatePath("/admin/team");
  return { ok: true };
}

export async function setUserActive(userId: string, active: boolean): Promise<TeamActionResult> {
  const admin = await requireAdmin();
  if (userId === admin.id) return { error: "You can't deactivate your own account." };

  const user = await db.user.update({ where: { id: userId }, data: { active } });
  await logActivity(admin, {
    action: "user.active",
    entity: "User",
    entityId: userId,
    detail: `${active ? "Reactivated" : "Deactivated"} ${user.name}`,
  });
  revalidatePath("/admin/team");
  return { ok: true };
}

export async function resetUserPassword(userId: string, newPassword: string): Promise<TeamActionResult> {
  const admin = await requireAdmin();
  if (newPassword.length < 8) return { error: "Password must be at least 8 characters." };

  const user = await db.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });
  await logActivity(admin, {
    action: "user.password",
    entity: "User",
    entityId: userId,
    detail: `Reset password for ${user.name}`,
  });
  return { ok: true };
}

export async function setUserRole(userId: string, role: string): Promise<TeamActionResult> {
  const admin = await requireAdmin();
  if (userId === admin.id) return { error: "You can't change your own role." };
  const nextRole = role === "ADMIN" ? "ADMIN" : "MEMBER";

  const user = await db.user.update({ where: { id: userId }, data: { role: nextRole } });
  await logActivity(admin, {
    action: "user.role",
    entity: "User",
    entityId: userId,
    detail: `Changed ${user.name}'s role to ${nextRole === "ADMIN" ? "Admin" : "Member"}`,
  });
  revalidatePath("/admin/team");
  return { ok: true };
}

export async function setUserPermissions(userId: string, permissions: string[]): Promise<TeamActionResult> {
  const admin = await requireAdmin();
  const clean = sanitizePermissions(permissions);

  const user = await db.user.update({
    where: { id: userId },
    data: { permissions: clean },
  });
  await logActivity(admin, {
    action: "user.permissions",
    entity: "User",
    entityId: userId,
    detail: `Updated ${user.name}'s permissions (${clean.length} granted)`,
  });
  revalidatePath("/admin/team");
  return { ok: true };
}
