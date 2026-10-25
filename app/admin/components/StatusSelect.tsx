
"use client";

import { updateReservationStatus } from "@/app/actions/reservation";
import { useState, useTransition } from "react";

type Status = "pending" | "confirmed" | "cancelled";

export default function StatusSelect({
  reservationId,
  initialStatus,
}: {
  reservationId: number;
  initialStatus: Status;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleChange(newStatus: Status) {
    const previousStatus = status;

    setStatus(newStatus);
    setError("");

    startTransition(async () => {
      try {
        await updateReservationStatus(reservationId, newStatus);
      } catch {
        setStatus(previousStatus);
        setError("Failed to update status");
      }
    });
  }

  return (
    <div>
      <select
        value={status}
        disabled={isPending}
        onChange={(event) =>
          handleChange(event.target.value as Status)
        }
        className="rounded border border-gray-300 p-1"
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {isPending && (
        <span className="ml-2 text-sm">Updating...</span>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
