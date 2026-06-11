"use client";

import { useTransition } from "react";
import { updateLeadStatus, assignLead, deleteLead } from "@/app/admin/(panel)/leads/actions";
import { LEAD_STATUSES, STATUS_LABELS } from "@/components/admin/StatusBadge";
import shared from "./shared.module.css";
import styles from "./LeadControls.module.css";

interface LeadControlsProps {
  leadId: string;
  status: string;
  assignedToId: string | null;
  users: { id: string; name: string }[];
}

export default function LeadControls({ leadId, status, assignedToId, users }: LeadControlsProps) {
  const [pending, startTransition] = useTransition();

  return (
    <div className={styles.controls}>
      <div className="form-group">
        <label className="form-label" htmlFor="lead-status">Status</label>
        <select
          id="lead-status"
          className="form-select"
          defaultValue={status}
          disabled={pending}
          onChange={(e) => startTransition(() => updateLeadStatus(leadId, e.target.value))}
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="lead-assignee">Assigned to</label>
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
    </div>
  );
}
