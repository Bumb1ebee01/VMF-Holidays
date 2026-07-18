"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "@/app/admin/(panel)/bookings/actions";
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from "@/lib/bookings";

export default function BookingStatusControl({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      className="form-select"
      defaultValue={status}
      disabled={pending}
      aria-label="Booking status"
      onChange={(e) => startTransition(() => updateBookingStatus(bookingId, e.target.value))}
    >
      {BOOKING_STATUSES.map((s) => (
        <option key={s} value={s}>{BOOKING_STATUS_LABELS[s]}</option>
      ))}
    </select>
  );
}
