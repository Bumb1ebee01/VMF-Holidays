"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateLeadStatus } from "@/app/admin/(panel)/leads/actions";
import { LEAD_STATUSES, STATUS_LABELS, type LeadStatusValue } from "@/components/admin/StatusBadge";
import styles from "./LeadBoard.module.css";

export interface BoardLead {
  id: string;
  name: string;
  interest: string;
  contact: string;
  assignedName: string | null;
  status: LeadStatusValue;
  when: string;
}

export default function LeadBoard({ leads, canEdit }: { leads: BoardLead[]; canEdit: boolean }) {
  const [items, setItems] = useState(leads);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function move(id: string, status: LeadStatusValue) {
    const current = items.find((l) => l.id === id);
    if (!current || current.status === status) return;
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    startTransition(() => {
      updateLeadStatus(id, status).catch(() => {
        // revert on failure
        setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status: current.status } : l)));
      });
    });
  }

  return (
    <div className={styles.board}>
      {LEAD_STATUSES.map((status) => {
        const colLeads = items.filter((l) => l.status === status);
        return (
          <div
            key={status}
            className={`${styles.column} ${overCol === status ? styles.columnOver : ""}`}
            onDragOver={(e) => {
              if (!canEdit || !dragId) return;
              e.preventDefault();
              setOverCol(status);
            }}
            onDragLeave={() => setOverCol((c) => (c === status ? null : c))}
            onDrop={(e) => {
              e.preventDefault();
              if (canEdit && dragId) move(dragId, status);
              setDragId(null);
              setOverCol(null);
            }}
          >
            <div className={styles.colHead}>
              <span className={`${styles.dot} ${styles[`dot${status}`]}`} />
              <span className={styles.colName}>{STATUS_LABELS[status]}</span>
              <span className={styles.colCount}>{colLeads.length}</span>
            </div>

            <div className={styles.cards}>
              {colLeads.length === 0 ? (
                <p className={styles.colEmpty}>—</p>
              ) : (
                colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`${styles.card} ${dragId === lead.id ? styles.cardDragging : ""}`}
                    draggable={canEdit}
                    onDragStart={() => setDragId(lead.id)}
                    onDragEnd={() => { setDragId(null); setOverCol(null); }}
                  >
                    <Link href={`/admin/leads/${lead.id}`} className={styles.cardName}>
                      {lead.name}
                    </Link>
                    <p className={styles.cardInterest}>{lead.interest}</p>
                    <p className={styles.cardContact}>{lead.contact}</p>
                    <div className={styles.cardFoot}>
                      <span>{lead.assignedName ?? "Unassigned"}</span>
                      <span>{lead.when}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
