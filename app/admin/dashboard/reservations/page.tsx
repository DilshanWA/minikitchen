
import { getSupabaseServerClient } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth";
import StatusSelect from "../../components/StatusSelect";


type Reservation = {
  id: number;
  name: string;
  email: string;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  occasion: string | null;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
};

export default async function ReservationsPage() {
  await requireAuth();
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("reservations")
    .select(
      "id, name, email, reservation_date, reservation_time, guests, occasion, notes, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch reservations:", error.message);
    throw new Error("Unable to load reservations");
  }

  const reservations = (data ?? []).map((reservation) => ({
    ...reservation,
    status: String(reservation.status).toLowerCase() as Reservation["status"],
  }));

  return (
    <main className="mx-auto max-w-7xl p-6">
      <p className="mb-6 text-3xl font-bold">
        Reservations
      </p>

      <p className="mb-4 text-gray-600">
        Total reservations: {reservations.length}
      </p>

      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Guest</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Guests</th>
              <th className="p-3">Occasion</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="border-t">
                <td className="p-3">
                  <p className="text-gray-500">
                    {reservation.name}
                  </p>
                </td>
                <td className="p-3">
                  <p className="text-gray-500">
                    {reservation.email}
                  </p>
                </td>

                <td className="p-3">
                  {reservation.reservation_date}
                </td>

                <td className="p-3">
                  {reservation.reservation_time}
                </td>

                <td className="p-3">
                  {reservation.guests}
                </td>

                <td className="p-3">
                  {reservation.occasion || "—"}
                </td>

                <td className="p-3">
                  <StatusSelect
                    reservationId={reservation.id}
                    initialStatus={reservation.status}
                  />
                </td>
              </tr>
            ))}

            {reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
