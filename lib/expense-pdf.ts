import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import {
  allItems,
  categoryTotal,
  computeLedger,
  settle,
  computeBalances,
  type Category,
  type Person,
  type Currency,
} from "./expense-split";

// Brand palette (RGB) — mirrors globals.css.
const NAVY: [number, number, number] = [0, 36, 100];
const NAVY_MID: [number, number, number] = [21, 70, 103];
const ORANGE: [number, number, number] = [254, 92, 16];
const INK: [number, number, number] = [26, 31, 54];
const MUTED: [number, number, number] = [123, 130, 152];
const LINE: [number, number, number] = [227, 223, 212];

export interface ExpensePdfData {
  tripName: string;
  tripDates?: string;
  currency: Currency;
  people: Person[];
  categories: Category[];
}

/** jsPDF's core fonts lack the ₹/฿ glyphs — use the ISO code for a clean, safe report. */
function money(minor: number, cur: Currency): string {
  const n = new Intl.NumberFormat(cur.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(minor) / 100);
  return `${cur.code} ${n}`;
}

async function loadImageDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateExpensePdf(data: ExpensePdfData): Promise<void> {
  const { tripName, tripDates, currency: cur, people, categories } = data;
  const items = allItems(categories);
  const nameById = (id: string) => people.find((p) => p.id === id)?.name.trim() || "Someone";

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentW = pageW - margin * 2;

  // ── Header band ──
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 40, "F");
  doc.setFillColor(...ORANGE);
  doc.rect(0, 40, pageW, 1.4, "F");

  const logo = await loadImageDataUrl("/logo-white.png");
  if (logo) {
    // logo-white.png is ~160×66 → keep aspect ratio at 34mm wide.
    doc.addImage(logo, "PNG", margin, 11, 34, 14);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("VMF Holidays", margin, 20);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Trip Expense Report", pageW - margin, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(210, 220, 240);
  const subtitle = [tripName.trim(), tripDates?.trim()].filter(Boolean).join("  ·  ") || "Group trip";
  doc.text(subtitle, pageW - margin, 25, { align: "right" });
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`,
    pageW - margin,
    31,
    { align: "right" }
  );

  let y = 52;

  // ── Summary strip ──
  const total = items.reduce((s, i) => s + i.amount, 0);
  const stats: [string, string][] = [
    ["Total spent", money(total, cur)],
    ["People", String(people.length)],
    ["Items", String(items.length)],
    ["Currency", cur.code],
  ];
  const boxW = contentW / stats.length;
  stats.forEach(([label, value], i) => {
    const x = margin + i * boxW;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...NAVY);
    doc.text(value, x, y + 6);
  });
  y += 12;
  doc.setDrawColor(...LINE);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  const sectionTitle = (title: string) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(title, margin, y);
    y += 2;
  };

  // ── Itemised breakdown by category ──
  sectionTitle("Itemised breakdown");
  for (const cat of categories) {
    if (cat.items.length === 0) continue;
    autoTable(doc, {
      startY: y + 2,
      head: [[`${cat.icon}  ${cat.name}`, "Paid by", "Split", "Amount"]],
      body: cat.items.map((it) => [
        it.label,
        nameById(it.paidBy),
        `${it.sharedBy.length} ${it.sharedBy.length === 1 ? "person" : "people"}`,
        money(it.amount, cur),
      ]),
      foot: [["Subtotal", "", "", money(categoryTotal(cat), cur)]],
      margin: { left: margin, right: margin },
      styles: { font: "helvetica", fontSize: 9, cellPadding: 2.2, textColor: INK, lineColor: LINE, lineWidth: 0.1 },
      headStyles: { fillColor: NAVY, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9.5 },
      footStyles: { fillColor: [244, 241, 234], textColor: NAVY, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [250, 249, 245] },
      columnStyles: { 3: { halign: "right" }, 2: { halign: "center" } },
    });
    // @ts-expect-error — lastAutoTable is added by the plugin at runtime.
    y = doc.lastAutoTable.finalY + 6;
  }

  // ── Per-person summary ──
  sectionTitle("Who paid what");
  const ledger = computeLedger(people, items);
  autoTable(doc, {
    startY: y + 2,
    head: [["Person", "Paid", "Fair share", "Balance"]],
    body: ledger.map((l) => {
      const bal = l.net === 0 ? "Settled" : l.net > 0 ? `Gets back ${money(l.net, cur)}` : `Owes ${money(l.net, cur)}`;
      return [nameById(l.personId), money(l.paid, cur), money(l.share, cur), bal];
    }),
    margin: { left: margin, right: margin },
    styles: { font: "helvetica", fontSize: 9, cellPadding: 2.2, textColor: INK, lineColor: LINE, lineWidth: 0.1 },
    headStyles: { fillColor: NAVY_MID, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9.5 },
    columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } },
  });
  // @ts-expect-error — lastAutoTable is added by the plugin at runtime.
  y = doc.lastAutoTable.finalY + 6;

  // ── Settlement ──
  sectionTitle("Settle up — the simplest way");
  const settlements = settle(computeBalances(people, items));
  if (settlements.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(21, 128, 61);
    doc.text("Everyone is square — no payments needed.", margin, y + 8);
    y += 12;
  } else {
    autoTable(doc, {
      startY: y + 2,
      head: [["From", "", "To", "Amount"]],
      body: settlements.map((s) => [nameById(s.fromId), "→", nameById(s.toId), money(s.amount, cur)]),
      margin: { left: margin, right: margin },
      styles: { font: "helvetica", fontSize: 9.5, cellPadding: 2.4, textColor: INK, lineColor: LINE, lineWidth: 0.1 },
      headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 1: { halign: "center", textColor: ORANGE, fontStyle: "bold" }, 3: { halign: "right", fontStyle: "bold" } },
    });
    // @ts-expect-error — lastAutoTable is added by the plugin at runtime.
    y = doc.lastAutoTable.finalY + 6;
  }

  // ── Footer on every page ──
  const pageCount = doc.getNumberOfPages();
  const pageH = doc.internal.pageSize.getHeight();
  for (let p = 1; p <= pageCount; p += 1) {
    doc.setPage(p);
    doc.setDrawColor(...LINE);
    doc.line(margin, pageH - 18, pageW - margin, pageH - 18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...NAVY);
    doc.text("VMF Holidays Pvt. Ltd.  ·  Discover Your World Your Way", margin, pageH - 13);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.setFontSize(8);
    doc.text(
      "+91 74993 22412  ·  info@vmfholidays.com  ·  vmfholidays.com",
      margin,
      pageH - 9
    );
    doc.text("Planning your next group trip? Talk to VMF.", pageW - margin, pageH - 13, { align: "right" });
    doc.text(`Page ${p} of ${pageCount}`, pageW - margin, pageH - 9, { align: "right" });
  }

  const safeName = (tripName.trim() || "trip").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`vmf-expense-report-${safeName}.pdf`);
}
