import styles from "./shared.module.css";

export const LEAD_STATUSES = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const;
export type LeadStatusValue = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatusValue, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUOTED: "Quoted",
  WON: "Won",
  LOST: "Lost",
};

export default function StatusBadge({ status }: { status: LeadStatusValue }) {
  return (
    <span className={`${styles.status} ${styles[`status${status}`]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
