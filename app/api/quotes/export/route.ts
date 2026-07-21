import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import { quoteForBooking, toRupees, COST_CATEGORY_LABELS, type CostCategory } from "@/lib/pricing";
import { csvCell } from "@/lib/travellers";
import { QUOTE_STATUS_LABELS, type QuoteStatusValue } from "@/lib/quotes";

export const dynamic = "force-dynamic";

const COLUMNS = [
  "Reference",
  "Version",
  "Option",
  "Status",
  "Customer",
  "Destination",
  "Package",
  "Pax",
  "Land cost",
  "Markup",
  "Markup % on cost",
  "Margin % of price",
  "GST",
  "TCS",
  "Quote price",
  "Per pax",
  "Cost breakdown",
  "Raised by",
  "Created",
  "Sent",
  "Accepted",
] as const;

const iso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
const money = (paise: number) => toRupees(paise).toFixed(2);

/**
 * Every quote as CSV, for analysis outside the CRM.
 *
 * Contains costs and margins, so it is ADMIN-only — the same bar as the quote
 * pages themselves, not merely bookings:manage.
 */
export async function GET() {
  const me = await requireUser();
  if (me.role !== "ADMIN") return new Response("Not found", { status: 404 });

  const quotes = await db.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      costLines: true,
      lead: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
  });

  const rows = quotes.map((q) => {
    const priced = quoteForBooking(q);
    // One cell summarising the components, so a spreadsheet can still show where
    // the money went without a second export to join against.
    const breakdown = q.costLines
      .map((l) => {
        const label = COST_CATEGORY_LABELS[l.category as CostCategory] ?? l.category;
        const amount =
          l.currency === "INR"
            ? `₹${toRupees(l.unitCostMinor).toFixed(2)}`
            : `${l.currency} ${(l.unitCostMinor / 100).toFixed(2)} @ ${l.fxRate}`;
        return `${label}: ${amount}${l.basis === "GROUP" ? " (group)" : " pp"}`;
      })
      .join("; ");

    return [
      q.ref,
      q.version,
      q.optionLabel ?? "",
      QUOTE_STATUS_LABELS[q.status as QuoteStatusValue] ?? q.status,
      q.customerName ?? q.lead?.name ?? "",
      q.destination ?? "",
      q.packageTitle ?? "",
      q.paxCount,
      priced ? money(priced.landCost) : "",
      priced ? money(priced.markup) : "",
      priced ? priced.markupPctOnCost.toFixed(1) : "",
      priced ? priced.marginPctOnPrice.toFixed(1) : "",
      priced ? money(priced.gst) : "",
      priced ? money(priced.tcs) : "",
      priced ? money(priced.total) : "",
      priced ? money(priced.perPax) : "",
      breakdown,
      q.createdBy?.name ?? "",
      iso(q.createdAt),
      iso(q.sentAt),
      iso(q.acceptedAt),
    ]
      .map(csvCell)
      .join(",");
  });

  const csv = [COLUMNS.map(csvCell).join(","), ...rows].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(
    // BOM so Excel reads it as UTF-8 and ₹ / accented names survive.
    "﻿" + csv,
    {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="vmf-quotes-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    }
  );
}
