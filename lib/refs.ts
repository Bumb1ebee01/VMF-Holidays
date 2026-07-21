import "server-only";
import { db } from "@/lib/db";
import { generateRef } from "@/lib/quotes";

/**
 * Mint an enquiry reference that isn't already taken.
 *
 * Every enquiry gets one at creation so the same code follows the customer
 * through quote revisions to the booking. Collisions are vanishingly unlikely
 * (31^6 ≈ 887 million) but a unique index would still throw, so retry rather
 * than risk failing an enquiry — losing a lead over a reference clash would be
 * a poor trade.
 */
export async function mintLeadRef(attempts = 8): Promise<string | null> {
  for (let i = 0; i < attempts; i += 1) {
    const ref = generateRef();
    const [lead, booking] = await Promise.all([
      db.lead.findUnique({ where: { ref }, select: { id: true } }),
      db.booking.findUnique({ where: { ref }, select: { id: true } }),
    ]);
    if (!lead && !booking) return ref;
  }
  // Null rather than throwing: the enquiry still saves, and the ref can be
  // backfilled later.
  console.error("[refs] could not mint a unique enquiry ref");
  return null;
}
