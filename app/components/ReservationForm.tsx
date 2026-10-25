"use client";

import { useActionState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { submitReservation, type ReservationState } from "../actions/reservation";

const initialState: ReservationState = { status: "idle" };

export default function ReservationForm() {
  const [state, formAction, isPending] = useActionState(submitReservation, initialState);
  const fieldClassName =
    "w-full border-0 border-b border-[#cbd0c9] bg-transparent px-0 py-[7px] pb-[11px] text-[13px] text-[var(--ink)] outline-none resize-y placeholder:text-[#a7ada6] focus:border-[var(--orange)]";
  const fieldLabelClassName = "grid gap-2 mb-5";
  const fieldLabelTextClassName = "text-[10px] uppercase tracking-[1.5px] font-bold";

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
    <form action={formAction} className="reservation-form bg-[var(--paper)] p-[35px] max-[800px]:p-6 max-[430px]:px-[18px]">
      <div className="grid grid-cols-2 gap-[18px] max-[430px]:grid-cols-1 max-[430px]:gap-0">
        <label className={fieldLabelClassName}>
          <span className={fieldLabelTextClassName}>Your name</span>
          <input className={fieldClassName} name="name" autoComplete="name" required placeholder="Alex Morgan" />
        </label>
        <label className={fieldLabelClassName}>
          <span className={fieldLabelTextClassName}>Email address</span>
          <input className={fieldClassName} name="email" type="email" autoComplete="email" required placeholder="alex@example.com" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-[18px] max-[430px]:grid-cols-1 max-[430px]:gap-0">
        <label className={fieldLabelClassName}>
          <span className={fieldLabelTextClassName}>Date</span>
          <input className={fieldClassName} name="date" type="date" required />
        </label>
        <label className={fieldLabelClassName}>
          <span className={fieldLabelTextClassName}>Time</span>
          <select className={fieldClassName} name="time" defaultValue="19:00" required>
            <option value="12:00">12:00 pm</option>
            <option value="13:00">1:00 pm</option>
            <option value="18:00">6:00 pm</option>
            <option value="19:00">7:00 pm</option>
            <option value="20:00">8:00 pm</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-[18px] max-[430px]:grid-cols-1 max-[430px]:gap-0">
        <label className={fieldLabelClassName}>
          <span className={fieldLabelTextClassName}>Guests</span>
          <select className={fieldClassName} name="guests" defaultValue="2" required>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}
          </select>
        </label>
        <label className={fieldLabelClassName}>
          <span className={fieldLabelTextClassName}>Occasion <i className="text-[#989f98] normal-case tracking-normal font-normal">(optional)</i>
          </span>
          <select className={fieldClassName} name="occasion" defaultValue="">
            <option value="">Just because</option>
            <option>Birthday</option>
            <option>Date night</option>
            <option>Business dinner</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <label className={fieldLabelClassName}>
        <span className={fieldLabelTextClassName}>Anything we should know?
          <i className="text-[#989f98] normal-case tracking-normal font-normal">(optional)</i>
        </span>
        <textarea className={fieldClassName} name="notes" rows={2} placeholder="Dietary requirements, high chair, a special request..." />
      </label>
      {state.status === "error" && 
        <p className="mb-2.5 -mt-1.5 text-xs text-[#b43d29]" role="alert">
          {state.message}
        </p>
      }
      <button 
        className="button button-dark mt-3 w-full"
        type="submit" 
        disabled={isPending}>{isPending ? "Saving your table..." : <>Request a reservation <ArrowUpRight size={17} /></>}
      </button>
      <p className="mt-[13px] text-center text-[10px] text-[#8b928b]">We&apos;ll confirm your reservation by email within a few minutes.</p>
    </form>
  );
}
