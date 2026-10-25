import { z } from "zod";

export const ReservationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reservationTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  guestCount: z.number().int().min(1).max(20),
  occasion: z.string().trim().max(100).default(""),
  notes: z.string().trim().max(1000).default(""),
});

export type Reservation = z.infer<typeof ReservationSchema>;