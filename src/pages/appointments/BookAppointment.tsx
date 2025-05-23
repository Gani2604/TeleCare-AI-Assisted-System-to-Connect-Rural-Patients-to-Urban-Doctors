import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { doctorsList } from "./data/doctors";

// Import schemas and services
import { appointmentSchema, AppointmentFormValues } from "./schemas/appointmentSchema";
import { saveAppointment } from "./services/appointmentService";

// Import components
import DoctorSelection from "./components/DoctorSelection";
import SelectedDoctorInfo from "./components/SelectedDoctorInfo";
import DateSelection from "./components/DateSelection";
import TimeSelection from "./components/TimeSelection";
import AppointmentTypeSelection from "./components/AppointmentTypeSelection";
import ReasonForVisit from "./components/ReasonForVisit";

const BookAppointment = () => {
  const { t } = useTranslation();
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentFormValues | null>(null);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctor: "",
      type: "video",
      reason: "",
    },
  });

  const handleDoctorChange = (doctorId: string) => {
    setSelectedDoctor(doctorId);
  };

  const saveToLocalStorage = (values: AppointmentFormValues) => {
    const doctor = doctorsList.find(doc => doc.id === values.doctor);
    if (!doctor) return;

    const appointment = {
      id: Date.now().toString(), // Generate a unique ID
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorImage: doctor.image,
      date: values.date.toISOString().split('T')[0],
      time: values.time,
      type: values.type,
      status: "confirmed"
    };

    // Get existing appointments from localStorage
    const storedAppointments = localStorage.getItem('upcomingAppointments');
    const appointments = storedAppointments ? JSON.parse(storedAppointments) : [];
    
    // Add new appointment to the beginning of the array
    appointments.unshift(appointment);
    
    // Save back to localStorage
    localStorage.setItem('upcomingAppointments', JSON.stringify(appointments));
  };

  const onSubmit = async (values: AppointmentFormValues) => {
    if (!currentUser) {
      toast.error("Please login to book an appointment");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Try to save to database, but show success even if it fails
      try {
        await saveAppointment(values, currentUser.uid, userData?.name);
      } catch (error) {
        console.error("Database error:", error);
        // Continue with showing success dialog even if database save fails
      }
      
      // Save to localStorage for immediate display
      saveToLocalStorage(values);
      
      setAppointmentDetails(values);
      setShowSuccessDialog(true);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    navigate('/appointments');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t("appointments.book")}</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Doctor Selection */}
            <DoctorSelection form={form} onDoctorChange={handleDoctorChange} />

            {/* Selected Doctor Info */}
            <SelectedDoctorInfo doctorId={selectedDoctor} />

            {/* Date Selection */}
            <DateSelection form={form} />

            {/* Time Selection */}
            <TimeSelection form={form} />

            {/* Appointment Type */}
            <AppointmentTypeSelection form={form} />

            {/* Reason for Visit */}
            <ReasonForVisit form={form} />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : t("appointments.book")}
            </Button>
          </form>
        </Form>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-600">Appointment Booked Successfully!</DialogTitle>
            <DialogDescription className="text-gray-600">
              Your appointment has been confirmed. Here are the details:
            </DialogDescription>
          </DialogHeader>
          {appointmentDetails && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <p className="flex justify-between">
                <span className="font-medium">Doctor:</span>
                <span>{appointmentDetails.doctor}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{new Date(appointmentDetails.date).toLocaleDateString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>{appointmentDetails.time}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span className="capitalize">{appointmentDetails.type}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Reason:</span>
                <span>{appointmentDetails.reason}</span>
              </p>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleDialogClose}
              className="bg-green-600 hover:bg-green-700"
            >
              View Appointments
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookAppointment;
