import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionUserId } from "./session";
import { can, type PermissionKey } from "@/lib/permissions";

export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "MEMBER";
  active: boolean;
  permissions: string[];
};

export async function getCurrentUser(): Promise<SafeUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, active: true, permissions: true },
  });
  if (!user || !user.active) return null;
  return user;
}

export async function requireUser(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdmin(): Promise<SafeUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/admin");
  return user;
}

/** Require a specific permission; admins always pass. Redirects if missing. */
export async function requirePermission(key: PermissionKey): Promise<SafeUser> {
  const user = await requireUser();
  if (!can(user, key)) redirect("/admin");
  return user;
}
