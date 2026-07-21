import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/user";
import QuoteBuilder from "@/components/admin/QuoteBuilder";
import QuoteHeaderActions from "@/components/admin/QuoteHeaderActions";
import { quoteLabel, QUOTE_STATUS_LABELS, type QuoteStatusValue } from "@/lib/quotes";
import shared from "@/components/admin/shared.module.css";
import lead from "@/app/admin/(panel)/leads/[id]/page.module.css";
import styles from "../quotes.module.css";

export const metadata: Metadata = { title: "Quote" };
export const dynamic = "force-dynamic";

const fmtDate = (d: Date | null) =>
  d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await requireUser();
  // Pricing is commercially sensitive — admins only.
  if (me.role !== "ADMIN") notFound();

  const quote = await db.quote.findUnique({
    where: { id },
    include: {
      costLines: { orderBy: { createdAt: "asc" } },
      lead: { select: { id: true, name: true, phone: true, email: true } },
      booking: { select: { id: true, customerName: true } },
      createdBy: { select: { name: true } },
    },
  });
  if (!quote) notFound();

  // Every version under this reference, so the history is one click away.
  const siblings = await db.quote.findMany({
    where: { ref: quote.ref },
    orderBy: [{ optionLabel: "asc" }, { version: "desc" }],
    select: { id: true, version: true, optionLabel: true, status: true },
  });

  const fields: [string, string | null][] = [
    ["Customer", quote.customerName ?? quote.lead?.name ?? null],
    ["Destination", quote.destination],
    ["Package", quote.packageTitle],
    ["Travel", quote.travelStart ? `${fmtDate(quote.travelStart)} → ${fmtDate(quote.travelEnd)}` : null],
    ["From enquiry", quote.lead?.name ?? null],
    ["Booking", quote.booking?.customerName ?? null],
    ["Raised by", quote.createdBy?.name ?? null],
    ["Sent", quote.sentAt ? fmtDate(quote.sentAt) : null],
  ];

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <Link href="/admin/quotes" className={lead.backLink}>← All quotes</Link>
          <h1 className={shared.pageTitle}>{quote.ref}</h1>
          <p className={shared.pageSub}>
            {quoteLabel(quote)} · {QUOTE_STATUS_LABELS[quote.status as QuoteStatusValue]}
          </p>
        </div>
        <QuoteHeaderActions quoteId={quote.id} status={quote.status} />
      </div>

      {siblings.length > 1 && (
        <div className={styles.versionBar}>
          <span className={styles.versionLabel}>Versions</span>
          {siblings.map((s) => (
            <Link
              key={s.id}
              href={`/admin/quotes/${s.id}`}
              className={`${styles.versionChip} ${s.id === quote.id ? styles.versionActive : ""}`}
              data-status={s.status}
            >
              {s.optionLabel ? `${s.optionLabel} · ` : ""}v{s.version}
            </Link>
          ))}
        </div>
      )}

      <div className={styles.detailGrid}>
        <QuoteBuilder
          quoteId={quote.id}
          paxCount={quote.paxCount}
          markupPct={quote.markupPct}
          priceOverride={quote.priceOverride}
          gstApplicable={quote.gstApplicable}
          gstRatePct={quote.gstRatePct}
          gstBase={quote.gstBase}
          tcsApplicable={quote.tcsApplicable}
          tcsRatePct={quote.tcsRatePct}
          costLines={quote.costLines}
        />

        <aside>
          <div className={`${shared.panel} ${shared.panelPad}`}>
            <h2 className={lead.panelTitle}>Trip</h2>
            <dl className={lead.fieldList}>
              {fields.map(([label, value]) =>
                value ? (
                  <div key={label} className={lead.fieldRow}>
                    <dt>{label}</dt>
                    <dd>
                      {label === "From enquiry" && quote.lead ? (
                        <Link href={`/admin/leads/${quote.lead.id}`}>{value}</Link>
                      ) : label === "Booking" && quote.booking ? (
                        <Link href={`/admin/bookings/${quote.booking.id}`}>{value}</Link>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ) : null
              )}
            </dl>
            {quote.notes && (
              <div className={lead.message}>
                <span className={lead.messageLabel}>Notes</span>
                <p>{quote.notes}</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
