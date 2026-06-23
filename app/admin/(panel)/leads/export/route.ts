import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { LEAD_STATUSES, type LeadStatusValue } from "@/components/admin/StatusBadge";
import type { LeadSource } from "@/lib/generated/prisma/client";
import { formatDateTime } from "@/lib/utils";

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  await requirePermission("leads:view");

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status") ?? undefined;
  const q = sp.get("q") ?? undefined;
  const source = sp.get("source") ?? undefined;
  const assignee = sp.get("assignee") ?? undefined;

  const activeStatus = LEAD_STATUSES.includes(status as LeadStatusValue)
    ? (status as LeadStatusValue)
    : undefined;

  const leads = await db.lead.findMany({
    where: {
      ...(activeStatus ? { status: activeStatus } : {}),
      ...(source ? { source: source as LeadSource } : {}),
      ...(assignee ? { assignedToId: assignee } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
              { destination: { contains: q, mode: "insensitive" } },
              { packageTitle: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { name: true } } },
  });

  const headers = [
    "Name", "Phone", "Email", "Status", "Source", "Destination", "Package",
    "Dates", "Travellers", "Trip length", "Contact mode", "Contact time",
    "Budget", "Interests", "Assigned to", "Message", "Received",
  ];

  const rows = leads.map((l) =>
    [
      l.name, l.phone, l.email, l.status, l.source, l.destination, l.packageTitle,
      l.dates, l.travelers, l.tripLength, l.contactMode, l.contactTime,
      l.budget, l.interests.join("; "), l.assignedTo?.name ?? "", l.message,
      formatDateTime(l.createdAt),
    ].map(csvCell).join(",")
  );

  const csv = "﻿" + [headers.map(csvCell).join(","), ...rows].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vmf-leads-${stamp}.csv"`,
    },
  });
}
