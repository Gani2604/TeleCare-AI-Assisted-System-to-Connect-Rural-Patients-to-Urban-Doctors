
import { format } from "date-fns";
import { dbService } from "@/lib/db-service";
import { toast } from "sonner";
import { doctorsList } from "../data/doctors";
import { AppointmentFormValues } from "../schemas/appointmentSchema";

export const saveAppointment = async (
  values: AppointmentFormValues,
  currentUserId: string,
  userName: string | undefined
) => {
  try {
    console.log("Starting appointment booking process...");
    
    // Get the doctor details
    const doctor = doctorsList.find(doc => doc.id === values.doctor);
    if (!doctor) {
      console.error("Selected doctor not found:", values.doctor);
      throw new Error("Selected doctor not found");
    }
    
    // Format the appointment data
    const appointmentData = {
      patientId: currentUserId,
      patientName: userName || "Patient",
      doctorId: values.doctor,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorImage: doctor.image,
      date: format(values.date, "yyyy-MM-dd"),
      time: values.time,
      type: values.type,
      reason: values.reason,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };
    
    // Log the appointment data being saved
    console.log("Saving appointment to MongoDB:", appointmentData);
    
    try {
      // Save the appointment to the database
      const savedAppointment = await dbService.saveAppointment(appointmentData);
      console.log("Appointment saved successfully:", savedAppointment);
      
      // Show success message
      toast.success("Appointment booked successfully!");
      
      // Update localStorage to immediately show in the AppointmentsUpcoming component
      const storedAppointments = localStorage.getItem('upcomingAppointments');
      const appointments = storedAppointments ? JSON.parse(storedAppointments) : [];
      appointments.unshift(appointmentData);
      localStorage.setItem('upcomingAppointments', JSON.stringify(appointments));
      
      return savedAppointment;
    } catch (dbError) {
      console.error("Database error saving appointment:", dbError);
      toast.error("Failed to save appointment to database. Please try again.");
      throw dbError;
    }
  } catch (error) {
    console.error("Error booking appointment:", error);
    toast.error("Failed to book appointment. Please try again.");
    throw error;
  }
};
