import { z} from "zod";

export const ReservationSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  contactDetails: z.string().trim().min(5).max(100),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reservationTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  guestCount: z.number().int().min(1).max(20),
});

export type Reservation = z.infer<typeof ReservationSchema>;