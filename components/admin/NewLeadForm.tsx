"use client";

import { useActionState } from "react";
import { createLead, type NewLeadState } from "@/app/admin/(panel)/leads/actions";
import shared from "./shared.module.css";

const initial: NewLeadState = {};

export default function NewLeadForm() {
  const [state, action, pending] = useActionState(createLead, initial);

  return (
    <form action={action} className={shared.formGrid}>
      <div className="form-group">
        <label className="form-label" htmlFor="nl-name">Full name *</label>
        <input id="nl-name" name="name" type="text" className="form-input" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="nl-phone">Phone *</label>
        <input id="nl-phone" name="phone" type="tel" className="form-input" required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="nl-email">Email</label>
        <input id="nl-email" name="email" type="email" className="form-input" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="nl-dest">Destination / interest</label>
        <input id="nl-dest" name="destination" type="text" className="form-input" />
      </div>
      <div className={`form-group ${shared.formFull}`}>
        <label className="form-label" htmlFor="nl-msg">Notes</label>
        <textarea id="nl-msg" name="message" className="form-textarea" rows={3} />
      </div>
      {state.error && <p className={`${shared.error} ${shared.formFull}`}>{state.error}</p>}
      <div className={`${shared.formActions} ${shared.formFull}`}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : "Add lead"}
        </button>
      </div>
    </form>
  );
}
