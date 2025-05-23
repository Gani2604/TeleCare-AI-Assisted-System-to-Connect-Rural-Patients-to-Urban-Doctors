
import { z } from "zod";

export const appointmentSchema = z.object({
  doctor: z.string({
    required_error: "Please select a doctor",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  type: z.enum(["video", "inPerson"], {
    required_error: "Please select an appointment type",
  }),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters",
  }).max(500, {
    message: "Reason must not exceed 500 characters",
  }),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
