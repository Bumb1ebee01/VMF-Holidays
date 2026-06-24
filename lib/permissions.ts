// ─────────────────────────────────────────────────────────────────────────────
// ROLE-BASED PERMISSIONS
// ADMIN implicitly holds every permission. MEMBER holds only the keys granted to
// them (User.permissions). Use `can(user, key)` everywhere access is gated.
// ─────────────────────────────────────────────────────────────────────────────

export type PermissionKey =
  | "leads:view"
  | "leads:edit"
  | "leads:assign"
  | "leads:delete"
  | "packages:manage"
  | "destinations:manage"
  | "testimonials:manage"
  | "posts:manage"
  | "offers:manage"
  | "gallery:manage"
  | "activity:view-all";

export interface PermissionDef {
  key: PermissionKey;
  label: string;
  group: string;
  hint: string;
}

export const PERMISSIONS: PermissionDef[] = [
  { key: "leads:view", label: "View leads", group: "Leads", hint: "See the leads list and details" },
  { key: "leads:edit", label: "Update lead status", group: "Leads", hint: "Change status and add notes" },
  { key: "leads:assign", label: "Assign leads", group: "Leads", hint: "Assign leads to team members" },
  { key: "leads:delete", label: "Delete leads", group: "Leads", hint: "Permanently remove a lead" },
  { key: "packages:manage", label: "Manage packages", group: "Content", hint: "Create, edit and delete packages" },
  { key: "destinations:manage", label: "Manage destinations", group: "Content", hint: "Create, edit and delete destinations" },
  { key: "testimonials:manage", label: "Manage testimonials", group: "Content", hint: "Create, edit and delete testimonials" },
  { key: "posts:manage", label: "Manage blog", group: "Content", hint: "Write, edit and delete blog posts" },
  { key: "offers:manage", label: "Manage offers", group: "Content", hint: "Post and remove offer flyers" },
  { key: "gallery:manage", label: "Manage gallery", group: "Content", hint: "Add and remove gallery photos" },
  { key: "activity:view-all", label: "View everyone's activity", group: "Oversight", hint: "See the full team activity log, not just their own" },
];

/** The permissions a brand-new member starts with. */
export const DEFAULT_MEMBER_PERMISSIONS: PermissionKey[] = [
  "leads:view",
  "leads:edit",
];

export const ALL_PERMISSION_KEYS = PERMISSIONS.map((p) => p.key);

interface PermissionSubject {
  role: "ADMIN" | "MEMBER";
  permissions?: string[] | null;
}

export function can(user: PermissionSubject | null | undefined, key: PermissionKey): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return (user.permissions ?? []).includes(key);
}

export function sanitizePermissions(input: unknown): PermissionKey[] {
  if (!Array.isArray(input)) return [];
  return ALL_PERMISSION_KEYS.filter((k) => input.includes(k));
}
