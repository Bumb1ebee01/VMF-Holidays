"use server";

import { db } from "@/lib/db";
import { getCurrentMember } from "@/lib/auth/member";
import type { Prisma } from "@/lib/generated/prisma/client";

// Save & resume for the Trip Builder — one draft per logged-in member. The wizard
// serialises its own state to a compact JSON blob; we store it verbatim and hand it
// back on return. Anonymous visitors get no draft (these all no-op without a member).

export type SavedTripDraft = { state: unknown; savedAt: string };

// Every DB call is wrapped so the feature degrades to "off" (never crashes the
// page) if the TripDraft table hasn't been migrated yet — deploy is safe before db push.

/** Upsert the current member's Trip Builder draft. No-op for anonymous visitors. */
export async function saveTripDraft(state: unknown): Promise<{ ok: boolean }> {
  const member = await getCurrentMember();
  if (!member) return { ok: false };
  const json = state as Prisma.InputJsonValue;
  try {
    await db.tripDraft.upsert({
      where: { memberId: member.id },
      update: { state: json },
      create: { memberId: member.id, state: json },
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** Load the current member's saved draft, if any. */
export async function loadTripDraft(): Promise<SavedTripDraft | null> {
  const member = await getCurrentMember();
  if (!member) return null;
  try {
    const draft = await db.tripDraft.findUnique({ where: { memberId: member.id } });
    return draft ? { state: draft.state, savedAt: draft.updatedAt.toISOString() } : null;
  } catch {
    return null;
  }
}

/** Drop the current member's draft (on submit, or "start fresh"). */
export async function clearTripDraft(): Promise<void> {
  const member = await getCurrentMember();
  if (!member) return;
  try {
    await db.tripDraft.deleteMany({ where: { memberId: member.id } });
  } catch {
    /* table not migrated yet — nothing to clear */
  }
}
