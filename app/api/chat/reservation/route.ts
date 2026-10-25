import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ReservationSchema } from '@/schemas/reservation'



function isRealDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ReservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide valid reservation details." },
        { status: 400 },
      );
    }

    const reservation = parsed.data;

    if (!isRealDate(reservation.reservationDate)) {
      return NextResponse.json(
        { error: "The reservation date is invalid." },
        { status: 400 },
      );
    }

    // Compare date strings in YYYY-MM-DD format.
    // For production, also validate the date against the restaurant's
    // local timezone and opening hours.
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    if (reservation.reservationDate < today) {
      return NextResponse.json(
        { error: "Please select today or a future date." },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );

    const { data, error } = await supabase
      .from("reservations")
      .insert({
        customer_name: reservation.customerName,
        contact_details: reservation.contactDetails,
        reservation_date: reservation.reservationDate,
        reservation_time: reservation.reservationTime,
        guest_count: reservation.guestCount,
        status: "pending",
      })
      .select("id, status")
      .single();

    if (error) {
      console.error("Reservation insert failed:", error.message);

      return NextResponse.json(
        { error: "Unable to save your reservation. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      reservationId: data.id,
      status: data.status,
      message:
        "Your reservation request has been submitted and is awaiting confirmation.",
    });
  } catch (error) {
    console.error("Reservation API error:", error);

    return NextResponse.json(
      { error: "Something went wrong while submitting your reservation." },
      { status: 500 },
    );
  }
}
