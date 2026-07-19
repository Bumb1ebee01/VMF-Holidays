"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import StatusBadge, { LEAD_STATUSES, STATUS_LABELS, type LeadStatusValue } from "./StatusBadge";
import { bulkUpdateLeads, type BulkOp } from "@/app/admin/(panel)/leads/actions";
import shared from "./shared.module.css";
import styles from "./LeadBulkTable.module.css";

export interface BulkRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  source: string;
  assignedName: string | null;
  status: string;
  when: string;
  urgent: boolean;
}

interface Props {
  rows: BulkRow[];
  users: { id: string; name: string }[];
  canEdit: boolean;
  canAssign: boolean;
}

export default function LeadBulkTable({ rows, users, canEdit, canAssign }: Props) {
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [pending, start] = useTransition();
  const [tag, setTag] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSel((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const toggleAll = () =>
    setSel((s) => (s.size === rows.length ? new Set() : new Set(rows.map((r) => r.id))));

  const apply = (op: BulkOp) => {
    setMsg(null);
    start(async () => {
      const r = await bulkUpdateLeads([...sel], op);
      if (r.error) setMsg(r.error);
      else {
        setMsg(`Updated ${r.count} lead${r.count === 1 ? "" : "s"}.`);
        setSel(new Set());
        setTag("");
      }
    });
  };

  const allChecked = rows.length > 0 && sel.size === rows.length;

  return (
    <div>
      {canEdit && sel.size > 0 && (
        <div className={styles.bar}>
          <span className={styles.count}>{sel.size} selected</span>
          {canAssign && (
            <select
              className="form-select"
              defaultValue=""
              disabled={pending}
              onChange={(e) => {
                const v = e.target.value;
                e.currentTarget.selectedIndex = 0;
                if (v) apply({ type: "assign", value: v === "__unassign" ? "" : v });
              }}
            >
              <option value="">Assign to…</option>
              <option value="__unassign">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          )}
          <select
            className="form-select"
            defaultValue=""
            disabled={pending}
            onChange={(e) => {
              const v = e.target.value;
              e.currentTarget.selectedIndex = 0;
              if (v) apply({ type: "status", value: v });
            }}
          >
            <option value="">Set status…</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <div className={styles.tagAdd}>
            <input
              className="form-input"
              placeholder="Add tag"
              value={tag}
              disabled={pending}
              onChange={(e) => setTag(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-navy btn--sm"
              disabled={pending || !tag.trim()}
              onClick={() => apply({ type: "tag", value: tag })}
            >
              Add
            </button>
          </div>
          {pending && <span className={styles.count}>Working…</span>}
        </div>
      )}
      {msg && <p className={styles.msg}>{msg}</p>}

      <div className={shared.panel}>
        <table className={`${shared.table} ${shared.tableHover}`}>
          <thead>
            <tr>
              {canEdit && (
                <th style={{ width: 34 }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} aria-label="Select all" />
                </th>
              )}
              <th>Name</th>
              <th>Contact</th>
              <th>Interest</th>
              <th>Source</th>
              <th>Assigned</th>
              <th>Status</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={sel.has(r.id) ? styles.selRow : ""}>
                {canEdit && (
                  <td>
                    <input
                      type="checkbox"
                      checked={sel.has(r.id)}
                      onChange={() => toggle(r.id)}
                      aria-label={`Select ${r.name}`}
                    />
                  </td>
                )}
                <td>
                  <Link href={`/admin/leads/${r.id}`} className={shared.rowLink}>{r.name}</Link>
                  {r.urgent && <span className={styles.urgent}>Travelling soon</span>}
                </td>
                <td>
                  <div className={styles.contact}>
                    <span>{r.phone}</span>
                    <span className={styles.contactSub}>{r.email}</span>
                  </div>
                </td>
                <td>{r.interest}</td>
                <td>{r.source}</td>
                <td>{r.assignedName ?? "—"}</td>
                <td><StatusBadge status={r.status as LeadStatusValue} /></td>
                <td className={styles.date}>{r.when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
