import { db } from "@/lib/db";
import type { SafeUser } from "@/lib/auth/user";

interface LogInput {
  action: string;
  entity: string;
  entityId?: string | null;
  detail?: string | null;
}

/**
 * Append an entry to the team activity log. Best-effort: a logging failure must
 * never break the underlying action, so errors are swallowed (and reported).
 */
export async function logActivity(actor: Pick<SafeUser, "id" | "name">, input: LogInput) {
  try {
    await db.activityLog.create({
      data: {
        userId: actor.id,
        userName: actor.name,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        detail: input.detail ?? null,
      },
    });
  } catch (err) {
    console.error("[activity] failed to record:", err);
  }
}
