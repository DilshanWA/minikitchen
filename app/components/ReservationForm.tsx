"use client";

import { useActionState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { submitReservation, type ReservationState } from "../actions/reservation";

const initialState: ReservationState = { status: "idle" };

export default function ReservationForm() {
  const [state, formAction, isPending] = useActionState(submitReservation, initialState);

  if (state.status === "success") {
    return (
      <div className="reservation-success">
        <CheckCircle2 size={40} />
        <p className="eyebrow">You&apos;re on the list</p>
        <h3>See you at the table.</h3>
        <p>{state.message}</p>
        <button className="text-link dark-link cursor-pointer" onClick={() => window.location.reload()}>
          Make another reservation <ArrowUpRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="reservation-form">
      <div className="form-row">
        <label>
          <span>Your name</span>
          <input name="name" autoComplete="name" required placeholder="Alex Morgan" />
        </label>
        <label>
          <span>Email address</span>
          <input name="email" type="email" autoComplete="email" required placeholder="alex@example.com" />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>Date</span>
          <input name="date" type="date" required />
        </label>
        <label>
          <span>Time</span>
          <select name="time" defaultValue="19:00" required>
            <option value="12:00">12:00 pm</option>
            <option value="13:00">1:00 pm</option>
            <option value="18:00">6:00 pm</option>
            <option value="19:00">7:00 pm</option>
            <option value="20:00">8:00 pm</option>
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>Guests</span>
          <select name="guests" defaultValue="2" required>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}
          </select>
        </label>
        <label>
          <span>Occasion <i>(optional)</i>
          </span>
          <select name="occasion" defaultValue="">
            <option value="">Just because</option>
            <option>Birthday</option>
            <option>Date night</option>
            <option>Business dinner</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <label>
        <span>Anything we should know? 
          <i>(optional)</i>
        </span>
        <textarea name="notes" rows={2} placeholder="Dietary requirements, high chair, a special request..." />
      </label>
      {state.status === "error" && 
        <p className="form-error" role="alert">
          {state.message}
        </p>
      }
      <button 
        className="button button-dark form-submit" 
        type="submit" 
        disabled={isPending}>{isPending ? "Saving your table..." : <>Request a reservation <ArrowUpRight size={17} /></>}
      </button>
      <p className="form-note">We&apos;ll confirm your reservation by email within a few minutes.</p>
    </form>
  );
}
