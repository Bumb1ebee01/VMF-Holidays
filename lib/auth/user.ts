import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionClaims } from "./session";
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
  const claims = await getSessionClaims();
  if (!claims) return null;
  const user = await db.user.findUnique({
    where: { id: claims.userId },
    select: { id: true, email: true, name: true, role: true, active: true, permissions: true, sessionVersion: true },
  });
  if (!user || !user.active) return null;
  // Stateful revocation: a token issued before the user's sessionVersion was
  // bumped (password reset / forced sign-out) is no longer valid.
  if (user.sessionVersion !== claims.ver) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active,
    permissions: user.permissions,
  };
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
