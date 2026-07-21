"use client";

import { useState, useActionState, useTransition } from "react";
import {
  addTraveller,
  updateTraveller,
  deleteTraveller,
  type TravellerState,
} from "@/app/admin/(panel)/bookings/actions";
import {
  TRAVELLER_TYPES,
  TRAVELLER_TYPE_LABELS,
  ageOn,
  countByType,
  sortTravellers,
  type TravellerTypeValue,
} from "@/lib/travellers";
import shared from "./shared.module.css";
import styles from "./TravellerManifest.module.css";

export interface ManifestRow {
  id: string;
  fullName: string;
  type: string;
  dateOfBirth: Date | null;
  gender: string | null;
  nationality: string | null;
  phone: string | null;
  email: string | null;
  isLead: boolean;
  notes: string | null;
}

const initialState: TravellerState = {};
const toDateInput = (d: Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : "");

/** Shared field set for both the add and edit forms. */
function TravellerFields({ v }: { v?: ManifestRow }) {
  return (
    <div className={styles.grid}>
      <div className={styles.full}>
        <label className="form-label" htmlFor={`name-${v?.id ?? "new"}`}>
          Full name (as on their travel document)
        </label>
        <input
          id={`name-${v?.id ?? "new"}`}
          name="fullName"
          className="form-input"
          defaultValue={v?.fullName ?? ""}
          maxLength={120}
          required
        />
      </div>

      <div>
        <label className="form-label" htmlFor={`type-${v?.id ?? "new"}`}>Type</label>
        <select
          id={`type-${v?.id ?? "new"}`}
          name="type"
          className="form-input"
          defaultValue={v?.type ?? "ADULT"}
        >
          {TRAVELLER_TYPES.map((t) => (
            <option key={t} value={t}>{TRAVELLER_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label" htmlFor={`dob-${v?.id ?? "new"}`}>Date of birth</label>
        <input
          id={`dob-${v?.id ?? "new"}`}
          name="dateOfBirth"
          type="date"
          className="form-input"
          defaultValue={toDateInput(v?.dateOfBirth ?? null)}
        />
      </div>

      <div>
        <label className="form-label" htmlFor={`gender-${v?.id ?? "new"}`}>Gender</label>
        <input
          id={`gender-${v?.id ?? "new"}`}
          name="gender"
          className="form-input"
          defaultValue={v?.gender ?? ""}
          maxLength={30}
          placeholder="As required by the airline"
        />
      </div>

      <div>
        <label className="form-label" htmlFor={`nat-${v?.id ?? "new"}`}>Nationality</label>
        <input
          id={`nat-${v?.id ?? "new"}`}
          name="nationality"
          className="form-input"
          defaultValue={v?.nationality ?? ""}
          maxLength={60}
          placeholder="Indian"
        />
      </div>

      <div>
        <label className="form-label" htmlFor={`phone-${v?.id ?? "new"}`}>Phone</label>
        <input
          id={`phone-${v?.id ?? "new"}`}
          name="phone"
          className="form-input"
          defaultValue={v?.phone ?? ""}
          maxLength={40}
        />
      </div>

      <div>
        <label className="form-label" htmlFor={`email-${v?.id ?? "new"}`}>Email</label>
        <input
          id={`email-${v?.id ?? "new"}`}
          name="email"
          type="email"
          className="form-input"
          defaultValue={v?.email ?? ""}
          maxLength={200}
        />
      </div>

      <div className={styles.full}>
        <label className="form-label" htmlFor={`notes-${v?.id ?? "new"}`}>
          Notes — dietary, medical, room or seat preference
        </label>
        <input
          id={`notes-${v?.id ?? "new"}`}
          name="notes"
          className="form-input"
          defaultValue={v?.notes ?? ""}
          maxLength={500}
        />
      </div>

      <label className={styles.leadToggle}>
        <input type="checkbox" name="isLead" defaultChecked={v?.isLead ?? false} />
        <span>Main contact for the group</span>
      </label>
    </div>
  );
}

function AddForm({ bookingId, onDone }: { bookingId: string; onDone: () => void }) {
  const action = addTraveller.bind(null, bookingId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={async (fd) => {
        await formAction(fd);
        onDone();
      }}
      className={styles.form}
    >
      <TravellerFields />
      {state.error && <p className={shared.error}>{state.error}</p>}
      <div className={shared.formActions}>
        <button type="submit" className="btn btn-primary btn--sm" disabled={pending}>
          {pending ? "Adding…" : "Add traveller"}
        </button>
        <button type="button" className="btn btn-outline btn--sm" onClick={onDone} disabled={pending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function EditForm({
  row,
  bookingId,
  onDone,
}: {
  row: ManifestRow;
  bookingId: string;
  onDone: () => void;
}) {
  const action = updateTraveller.bind(null, row.id, bookingId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={async (fd) => {
        await formAction(fd);
        onDone();
      }}
      className={styles.form}
    >
      <TravellerFields v={row} />
      {state.error && <p className={shared.error}>{state.error}</p>}
      <div className={shared.formActions}>
        <button type="submit" className="btn btn-primary btn--sm" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
        <button type="button" className="btn btn-outline btn--sm" onClick={onDone} disabled={pending}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function TravellerManifest({
  bookingId,
  bookingRef,
  travellers,
  travelStart,
  canManage,
}: {
  bookingId: string;
  bookingRef: string;
  travellers: ManifestRow[];
  travelStart: Date | null;
  canManage: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const rows = sortTravellers(travellers);
  const counts = countByType(travellers);
  const at = travelStart ? new Date(travelStart) : undefined;

  const remove = (row: ManifestRow) => {
    if (!confirm(`Remove ${row.fullName} from the manifest?`)) return;
    startTransition(() => {
      void deleteTraveller(row.id, bookingId);
    });
  };

  return (
    <section className={shared.panel}>
      <div className={shared.panelPad}>
        <div className={styles.head}>
          <div>
            <h2 className={styles.title}>Group manifest</h2>
            <p className={styles.sub}>
              {rows.length === 0
                ? "The named travellers on this booking — what hotels and airlines ask for."
                : `${counts.total} traveller${counts.total === 1 ? "" : "s"} · ${counts.adults} adult${
                    counts.adults === 1 ? "" : "s"
                  }${counts.children ? `, ${counts.children} child${counts.children === 1 ? "" : "ren"}` : ""}${
                    counts.infants ? `, ${counts.infants} infant${counts.infants === 1 ? "" : "s"}` : ""
                  }`}
            </p>
          </div>
          <div className={styles.headActions}>
            {rows.length > 0 && (
              <a
                href={`/api/manifest/${bookingId}`}
                className="btn btn-outline btn--sm"
                download={`${bookingRef}-manifest.csv`}
              >
                Export CSV
              </a>
            )}
            {canManage && !adding && (
              <button type="button" className="btn btn-primary btn--sm" onClick={() => setAdding(true)}>
                Add traveller
              </button>
            )}
          </div>
        </div>

        {adding && <AddForm bookingId={bookingId} onDone={() => setAdding(false)} />}

        {rows.length === 0 && !adding ? (
          <p className={shared.empty}>
            No travellers added yet. The booking still shows its head count.
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={shared.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Age at travel</th>
                  <th>Contact</th>
                  <th>Notes</th>
                  {canManage && <th aria-label="Actions" />}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) =>
                  editingId === row.id ? (
                    <tr key={row.id}>
                      <td colSpan={canManage ? 6 : 5}>
                        <EditForm row={row} bookingId={bookingId} onDone={() => setEditingId(null)} />
                      </td>
                    </tr>
                  ) : (
                    <tr key={row.id}>
                      <td>
                        <span className={styles.name}>{row.fullName}</span>
                        {row.isLead && <span className={styles.leadPill}>Main contact</span>}
                        {row.nationality && <span className={styles.meta}>{row.nationality}</span>}
                      </td>
                      <td>{TRAVELLER_TYPE_LABELS[row.type as TravellerTypeValue] ?? row.type}</td>
                      <td>{ageOn(row.dateOfBirth, at) ?? "—"}</td>
                      <td>
                        {row.phone && <div>{row.phone}</div>}
                        {row.email && <div className={styles.meta}>{row.email}</div>}
                        {!row.phone && !row.email && "—"}
                      </td>
                      <td className={styles.notes}>{row.notes || "—"}</td>
                      {canManage && (
                        <td className={styles.rowActions}>
                          <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={() => setEditingId(row.id)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => remove(row)}
                            disabled={pending}
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {rows.length > 0 && (
          <p className={styles.privacy}>
            Passport and ID numbers are deliberately not stored here — collect those per trip
            and share them with suppliers directly.
          </p>
        )}
      </div>
    </section>
  );
}
