"use server";

import { requireAuth } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export type ReservationState = { status: "idle" } | { status: "success"; message: string } | { status: "error"; message: string };

const fields = ["name", "email", "date", "time", "guests", "occasion", "notes"] as const;
type ReservationStatus = "pending" | "confirmed" | "cancelled";

export async function submitReservation(_previousState: ReservationState, formData: FormData): Promise<ReservationState> {
  const values = Object.fromEntries(fields.map((field) => [field, String(formData.get(field) ?? "").trim()]));
  if (!values.name || !values.email || !values.date || !values.time || !values.guests) 
    return { 
      status: "error", 
      message: "Please fill in your name, email, date, time and number of guests." 
    };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) 
    return { 
      status: "error", 
      message: "Please enter a valid email address." 
    };
  if (values.name.length > 100 || values.notes.length > 1000) 
    return { 
      status: "error", 
      message: "Please shorten your message and try again." 
    };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) 
    return { 
      status: "error", 
      message: "Reservations are temporarily unavailable. Please call us on +61 3 9123 4567."
    };

  const supabase = createClient(url, key);
  const { error } = await supabase.from("reservations").insert({
    name: values.name,
    email: values.email,
    reservation_date: values.date,
    reservation_time: values.time,
    guests: Number(values.guests),
    occasion: values.occasion || null,
    notes: values.notes || null,
    status: "pending",
  });
  if (error) {
    console.error("Reservation insert failed:", error.message);
    return { status: "error", message: "We couldn't save that reservation. Please try again or call us directly." };
  }
  return { status: "success", message: `We've sent a confirmation to ${values.email}. We look forward to welcoming you.` };
}


export async function updateReservationStatus(
  reservationId: number,
  status: ReservationStatus
) {
  await requireAuth();
  const supabase = getSupabaseServerClient();

  if (!Number.isInteger(reservationId) || reservationId < 1) {
    throw new Error("Invalid reservation ID");
  }

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    throw new Error("Invalid reservation status");
  }

  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", reservationId);

  if (error) {
    console.error("Supabase update error:", error);
    throw new Error("Failed to update reservation status");
  }

  revalidatePath("/admin/dashboard/reservations");

  return { success: true };
}