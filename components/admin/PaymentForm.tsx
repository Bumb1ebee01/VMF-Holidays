"use client";

import { useActionState } from "react";
import { addPayment } from "@/app/admin/(panel)/bookings/actions";
import {
  PAYMENT_TYPES,
  PAYMENT_TYPE_LABELS,
  PAYMENT_MODES,
  PAYMENT_MODE_LABELS,
} from "@/lib/bookings";
import shared from "./shared.module.css";

export default function PaymentForm({ bookingId }: { bookingId: string }) {
  const action = addPayment.bind(null, bookingId);
  const [state, formAction, pending] = useActionState(action, {});
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className={shared.formGrid}>
      <div className="form-group">
        <label className="form-label" htmlFor="pay-amount">Amount (₹) *</label>
        <input id="pay-amount" name="amount" type="number" min="0" step="1" className="form-input" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="pay-date">Date</label>
        <input id="pay-date" name="paidAt" type="date" className="form-input" defaultValue={today} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="pay-type">Type</label>
        <select id="pay-type" name="type" className="form-select" defaultValue="ADVANCE">
          {PAYMENT_TYPES.map((t) => (
            <option key={t} value={t}>{PAYMENT_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="pay-mode">Mode</label>
        <select id="pay-mode" name="mode" className="form-select" defaultValue="BANK_TRANSFER">
          {PAYMENT_MODES.map((m) => (
            <option key={m} value={m}>{PAYMENT_MODE_LABELS[m]}</option>
          ))}
        </select>
      </div>
      <div className={`form-group ${shared.formFull}`}>
        <label className="form-label" htmlFor="pay-note">Note</label>
        <input id="pay-note" name="note" type="text" className="form-input" placeholder="e.g. advance via UPI, ref #1234" />
      </div>
      {state.error && <p className={`${shared.error} ${shared.formFull}`}>{state.error}</p>}
      <div className={`${shared.formActions} ${shared.formFull}`}>
        <button type="submit" className="btn btn-navy btn--sm" disabled={pending}>
          {pending ? "Recording…" : "Record payment"}
        </button>
      </div>
    </form>
  );
}
