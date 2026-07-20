import { describe, it, expect } from "vitest";
import {
  can,
  sanitizePermissions,
  ALL_PERMISSION_KEYS,
  ROLE_PRESETS,
  DEFAULT_MEMBER_PERMISSIONS,
  PERMISSIONS,
  type PermissionKey,
} from "@/lib/permissions";

const admin = { role: "ADMIN" as const, permissions: [] };
const member = (permissions: string[]) => ({ role: "MEMBER" as const, permissions });

describe("can", () => {
  it("grants an admin every permission, even with an empty permission list", () => {
    for (const key of ALL_PERMISSION_KEYS) {
      expect(can(admin, key)).toBe(true);
    }
  });

  it("grants a member only what they've been given", () => {
    const user = member(["leads:view"]);
    expect(can(user, "leads:view")).toBe(true);
    expect(can(user, "leads:delete")).toBe(false);
  });

  it("denies everything when there is no user", () => {
    expect(can(null, "leads:view")).toBe(false);
    expect(can(undefined, "leads:view")).toBe(false);
  });

  it("treats a missing or null permission list as no permissions", () => {
    expect(can({ role: "MEMBER", permissions: null }, "leads:view")).toBe(false);
    expect(can({ role: "MEMBER" }, "leads:view")).toBe(false);
  });
});

describe("sanitizePermissions", () => {
  it("drops keys that aren't real permissions", () => {
    // The guard that matters: a forged key from a tampered form must not survive.
    expect(sanitizePermissions(["leads:view", "admin:everything", "*"])).toEqual(["leads:view"]);
  });

  it("returns an empty list for anything that isn't an array", () => {
    for (const junk of [null, undefined, "leads:view", 42, {}]) {
      expect(sanitizePermissions(junk)).toEqual([]);
    }
  });

  it("keeps every valid key when given the full set", () => {
    expect(sanitizePermissions([...ALL_PERMISSION_KEYS])).toEqual(ALL_PERMISSION_KEYS);
  });

  it("de-duplicates repeats", () => {
    expect(sanitizePermissions(["leads:view", "leads:view"])).toEqual(["leads:view"]);
  });
});

describe("permission catalogue", () => {
  it("has no duplicate keys", () => {
    expect(new Set(ALL_PERMISSION_KEYS).size).toBe(ALL_PERMISSION_KEYS.length);
  });

  it("gives every permission a label, group and hint for the Team UI", () => {
    for (const p of PERMISSIONS) {
      expect(p.label.length, `${p.key} label`).toBeGreaterThan(0);
      expect(p.group.length, `${p.key} group`).toBeGreaterThan(0);
      expect(p.hint.length, `${p.key} hint`).toBeGreaterThan(0);
    }
  });

  it("only references real permission keys from the role presets", () => {
    // Catches a typo in a preset, which would otherwise silently grant nothing.
    for (const preset of ROLE_PRESETS) {
      for (const key of preset.keys) {
        expect(ALL_PERMISSION_KEYS, `preset "${preset.key}"`).toContain(key);
      }
    }
  });

  it("starts new members read-and-work-leads only, never with delete rights", () => {
    expect(DEFAULT_MEMBER_PERMISSIONS).not.toContain("leads:delete" as PermissionKey);
    expect(DEFAULT_MEMBER_PERMISSIONS).not.toContain("members:manage" as PermissionKey);
  });

  it("gives the 'full' preset everything and 'none' nothing", () => {
    expect(ROLE_PRESETS.find((p) => p.key === "full")?.keys).toEqual(ALL_PERMISSION_KEYS);
    expect(ROLE_PRESETS.find((p) => p.key === "none")?.keys).toEqual([]);
  });
});
