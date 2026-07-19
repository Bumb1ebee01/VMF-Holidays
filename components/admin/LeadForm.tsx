"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { LeadFormState } from "@/app/admin/(panel)/leads/actions";
import { LEAD_STATUSES, STATUS_LABELS } from "@/components/admin/StatusBadge";
import {
  LEAD_SOURCES,
  SOURCE_LABELS,
  TIMEFRAMES,
  CONTACT_MODES,
  HOTEL_CATEGORIES,
  MEAL_PLANS,
} from "@/components/admin/leadMeta";
import shared from "./shared.module.css";

export interface LeadFormValues {
  name?: string;
  phone?: string;
  email?: string;
  source?: string;
  destination?: string | null;
  packageTitle?: string | null;
  dates?: string | null;
  travelers?: string | null;
  tripLength?: string | null;
  timeframe?: string | null;
  contactMode?: string | null;
  contactTime?: string | null;
  budget?: string | null;
  hotelCategory?: string | null;
  mealPlan?: string | null;
  interests?: string[];
  tags?: string[];
  message?: string | null;
  followUpAt?: Date | string | null;
}

/** Date | ISO string → "YYYY-MM-DD" for a native date input (empty when unset). */
function toDateInput(v: Date | string | null | undefined): string {
  if (!v) return "";
  const d = typeof v === "string" ? new Date(v) : v;
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

interface LeadFormProps {
  action: (prev: LeadFormState, formData: FormData) => Promise<LeadFormState>;
  mode: "create" | "edit";
  lead?: LeadFormValues;
  /** Create-mode only: the team members a new lead can be assigned to. */
  users?: { id: string; name: string }[];
  cancelHref?: string;
}

export default function LeadForm({ action, mode, lead, users, cancelHref }: LeadFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const v = lead ?? {};

  return (
    <form action={formAction} className={shared.formGrid}>
      {/* Contact */}
      <div className="form-group">
        <label className="form-label" htmlFor="lf-name">Full name *</label>
        <input id="lf-name" name="name" type="text" className="form-input" required defaultValue={v.name ?? ""} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-phone">Phone *</label>
        <input id="lf-phone" name="phone" type="tel" className="form-input" required defaultValue={v.phone ?? ""} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-email">Email</label>
        <input id="lf-email" name="email" type="email" className="form-input" defaultValue={v.email ?? ""} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-source">Source</label>
        <select id="lf-source" name="source" className="form-select" defaultValue={v.source ?? "OTHER"}>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-follow">Next follow-up</label>
        <input id="lf-follow" name="followUpAt" type="date" className="form-input" defaultValue={toDateInput(v.followUpAt)} />
      </div>

      {mode === "create" && (
        <>
          <div className="form-group">
            <label className="form-label" htmlFor="lf-status">Status</label>
            <select id="lf-status" name="status" className="form-select" defaultValue="NEW">
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          {users && users.length > 0 && (
            <div className="form-group">
              <label className="form-label" htmlFor="lf-assignee">Assign to</label>
              <select id="lf-assignee" name="assignedToId" className="form-select" defaultValue="">
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {/* Trip details */}
      <p className={`${shared.formSection} ${shared.formFull}`}>Trip details</p>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-dest">Destination</label>
        <input id="lf-dest" name="destination" type="text" className="form-input" defaultValue={v.destination ?? ""} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-pkg">Package / trip</label>
        <input id="lf-pkg" name="packageTitle" type="text" className="form-input" defaultValue={v.packageTitle ?? ""} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-when">Travelling</label>
        <select id="lf-when" name="timeframe" className="form-select" defaultValue={v.timeframe ?? ""}>
          <option value="">—</option>
          {TIMEFRAMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-dates">Travel dates</label>
        <input id="lf-dates" name="dates" type="text" className="form-input" placeholder="e.g. 12–19 Nov 2026" defaultValue={v.dates ?? ""} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-trav">Travellers</label>
        <input id="lf-trav" name="travelers" type="text" className="form-input" placeholder="e.g. 2 adults, 1 child" defaultValue={v.travelers ?? ""} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-len">Approx. length</label>
        <input id="lf-len" name="tripLength" type="text" className="form-input" placeholder="e.g. 6 nights" defaultValue={v.tripLength ?? ""} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-budget">Budget</label>
        <input id="lf-budget" name="budget" type="text" className="form-input" placeholder="e.g. ₹80,000 pp" defaultValue={v.budget ?? ""} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-hotel">Hotel category</label>
        <select id="lf-hotel" name="hotelCategory" className="form-select" defaultValue={v.hotelCategory ?? ""}>
          <option value="">—</option>
          {HOTEL_CATEGORIES.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-meal">Meal plan</label>
        <select id="lf-meal" name="mealPlan" className="form-select" defaultValue={v.mealPlan ?? ""}>
          <option value="">—</option>
          {MEAL_PLANS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className={`form-group ${shared.formFull}`}>
        <label className="form-label" htmlFor="lf-interests">Interests</label>
        <input id="lf-interests" name="interests" type="text" className="form-input" placeholder="Comma-separated — e.g. honeymoon, beaches, adventure" defaultValue={(v.interests ?? []).join(", ")} />
      </div>
      <div className={`form-group ${shared.formFull}`}>
        <label className="form-label" htmlFor="lf-tags">Tags</label>
        <input id="lf-tags" name="tags" type="text" className="form-input" placeholder="Comma-separated labels — e.g. VIP, urgent, repeat customer" defaultValue={(v.tags ?? []).join(", ")} />
      </div>

      {/* Contact preference */}
      <p className={`${shared.formSection} ${shared.formFull}`}>Contact preference</p>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-cmode">Preferred contact</label>
        <select id="lf-cmode" name="contactMode" className="form-select" defaultValue={v.contactMode ?? ""}>
          <option value="">—</option>
          {CONTACT_MODES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="lf-ctime">Best time to reach</label>
        <input id="lf-ctime" name="contactTime" type="text" className="form-input" placeholder="e.g. Evenings, weekends" defaultValue={v.contactTime ?? ""} />
      </div>

      <div className={`form-group ${shared.formFull}`}>
        <label className="form-label" htmlFor="lf-msg">Notes</label>
        <textarea id="lf-msg" name="message" className="form-textarea" rows={4} defaultValue={v.message ?? ""} />
      </div>

      {state.error && <p className={`${shared.error} ${shared.formFull}`}>{state.error}</p>}

      <div className={`${shared.formActions} ${shared.formFull}`}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : mode === "create" ? "Add lead" : "Save changes"}
        </button>
        {cancelHref && (
          <Link href={cancelHref} className="btn btn-outline">Cancel</Link>
        )}
      </div>
    </form>
  );
}
