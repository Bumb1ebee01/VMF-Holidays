"use client";

import { useTransition } from "react";
import { updateLeadStatus, assignLead, deleteLead } from "@/app/admin/(panel)/leads/actions";
import { LEAD_STATUSES, STATUS_LABELS, type LeadStatusValue } from "@/components/admin/StatusBadge";
import shared from "./shared.module.css";
import styles from "./LeadControls.module.css";

interface LeadControlsProps {
  leadId: string;
  status: string;
  assignedToId: string | null;
  users: { id: string; name: string }[];
  canEdit?: boolean;
  canAssign?: boolean;
  canDelete?: boolean;
}

export default function LeadControls({
  leadId,
  status,
  assignedToId,
  users,
  canEdit = true,
  canAssign = true,
  canDelete = true,
}: LeadControlsProps) {
  const [pending, startTransition] = useTransition();

  return (
    <div className={styles.controls}>
      <div className={styles.block}>
        <span className={styles.label}>Status</span>
        <div className={styles.pills}>
          {LEAD_STATUSES.map((s) => {
            const active = s === status;
            return (
              <button
                key={s}
                type="button"
                disabled={pending || !canEdit || active}
                className={`${styles.pill} ${styles[`pill${s}`]} ${active ? styles.pillActive : ""}`}
                onClick={() => {
                  let reason: string | undefined;
                  if (s === "LOST") {
                    const r = window.prompt("Why was this lead lost? (optional — e.g. price, timing, went elsewhere)");
                    if (r === null) return; // cancelled — leave the status unchanged
                    reason = r;
                  }
                  startTransition(() => updateLeadStatus(leadId, s, reason));
                }}
              >
                {STATUS_LABELS[s as LeadStatusValue]}
              </button>
            );
          })}
        </div>
      </div>

      {canAssign && (
        <div className={styles.block}>
          <label className={styles.label} htmlFor="lead-assignee">Assigned to</label>
          <select
            id="lead-assignee"
            className="form-select"
            defaultValue={assignedToId ?? ""}
            disabled={pending}
            onChange={(e) => startTransition(() => assignLead(leadId, e.target.value))}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      )}

      {canDelete && (
        <button
          type="button"
          className={shared.dangerBtn}
          disabled={pending}
          onClick={() => {
            if (confirm("Delete this lead and all its notes? This cannot be undone.")) {
              startTransition(() => deleteLead(leadId));
            }
          }}
        >
          Delete Lead
        </button>
      )}
    </div>
  );
}
