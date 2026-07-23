"use client";

import { useActionState, useState } from "react";
import { createBookingFromLead, type BookingFormState } from "@/app/admin/(panel)/bookings/actions";
import shared from "./shared.module.css";
import { PHONE_HINT } from "@/lib/contact";

const initial: BookingFormState = {};
const col = { display: "flex", flexDirection: "column" as const, gap: 10, marginTop: 12 };
const row = { display: "flex", gap: 10 };

interface Prefill {
  name: string;
  phone: string;
  email: string;
  destination: string;
  packageTitle: string;
}

/** A priced quote offered as the "confirmed" one at booking time. */
export interface BookingQuotePick {
  id: string;
  label: string;
  /** Quote price in whole rupees. */
  total: number;
  paxCount: number;
}

export default function LeadBookingPanel({
  leadId,
  memberName,
  prefill,
  quotes = [],
}: {
  leadId: string;
  memberName: string | null;
  prefill: Prefill;
  quotes?: BookingQuotePick[];
}) {
  const action = createBookingFromLead.bind(null, leadId);
  const [state, formAction, pending] = useActionState(action, initial);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [quoteId, setQuoteId] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const totalPax = (Number(adults) || 0) + (Number(children) || 0) + (Number(infants) || 0);

  function onPickQuote(id: string) {
    setQuoteId(id);
    const q = quotes.find((x) => x.id === id);
    if (q) {
      // Prefill from the chosen quote — both stay editable so a rounded-off
      // figure or a different pax split can still be tweaked before saving.
      setTotalValue(String(q.total));
      setAdults(Math.max(1, q.paxCount));
      setChildren(0);
      setInfants(0);
    }
  }

  return (
    <div>
      <h3 className={shared.cardTitle}>Create booking</h3>
      <p className={shared.cardSub}>
        {memberName
          ? `${memberName} is a Travellers Club member — booking advances their referral to Booked (reward pays on trip completion).`
          : "Turns this won enquiry into a trip with a payment ledger, and sets the lead to Won."}
      </p>
      <form action={formAction} style={col}>
        <input type="hidden" name="acceptedQuoteId" value={quoteId} />

        {/* Confirmed quote — records which trip/price/margin was actually sold. */}
        {quotes.length > 0 && (
          <label className="form-group">
            <span className="form-label">Confirmed quote</span>
            <select
              className="form-input"
              value={quoteId}
              onChange={(e) => onPickQuote(e.target.value)}
            >
              <option value="">No linked quote — enter the value manually</option>
              {quotes.map((q) => (
                <option key={q.id} value={q.id}>{q.label}</option>
              ))}
            </select>
            <p className="form-hint">
              Links the winning quote to this booking and prefills the value &amp; pax (both stay editable).
            </p>
          </label>
        )}

        {/* Customer */}
        <label className="form-group">
          <span className="form-label">Customer name *</span>
          <input name="customerName" type="text" className="form-input" required defaultValue={prefill.name} />
        </label>
        <div style={row}>
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Phone *</span>
            <input name="customerPhone" type="tel" className="form-input" required defaultValue={prefill.phone} />
            <p className="form-hint">{PHONE_HINT}</p>
          </label>
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Email *</span>
            <input name="customerEmail" type="email" className="form-input" required defaultValue={prefill.email} />
          </label>
        </div>
        <div style={row}>
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Destination *</span>
            <input name="destination" type="text" className="form-input" required defaultValue={prefill.destination} />
          </label>
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Package / trip</span>
            <input name="packageTitle" type="text" className="form-input" defaultValue={prefill.packageTitle} />
          </label>
        </div>

        {/* Travel dates */}
        <div style={row}>
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Travel start *</span>
            <input name="travelStart" type="date" className="form-input" required />
          </label>
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Travel end *</span>
            <input name="travelEnd" type="date" className="form-input" required />
          </label>
        </div>

        {/* Travellers — auto-totalled */}
        <div style={row}>
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Adults *</span>
            <input
              name="adults"
              type="number"
              min="1"
              step="1"
              className="form-input"
              required
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
            />
          </label>
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Children</span>
            <input
              name="children"
              type="number"
              min="0"
              step="1"
              className="form-input"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
            />
          </label>
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Infants</span>
            <input
              name="infants"
              type="number"
              min="0"
              step="1"
              className="form-input"
              value={infants}
              onChange={(e) => setInfants(Number(e.target.value))}
            />
          </label>
        </div>
        <p className={shared.cardSub} style={{ margin: 0 }}>
          Total travellers: <strong>{totalPax}</strong>
        </p>

        {/* Value */}
        <label className="form-group">
          <span className="form-label">Total value (₹) *</span>
          <input
            name="totalValue"
            type="number"
            min="1"
            step="1"
            className="form-input"
            required
            placeholder="e.g. 160000"
            value={totalValue}
            onChange={(e) => setTotalValue(e.target.value)}
          />
        </label>

        {state.error && <p className={shared.error}>{state.error}</p>}
        <button type="submit" className="btn btn-primary btn--sm" disabled={pending}>
          {pending ? "Creating…" : "Create booking"}
        </button>
      </form>
    </div>
  );
}
