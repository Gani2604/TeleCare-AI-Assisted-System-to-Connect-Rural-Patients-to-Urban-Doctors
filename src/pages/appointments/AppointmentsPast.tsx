
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

// Dummy data for past appointments
const pastAppointmentsData = [
  {
    id: 101,
    doctorName: "Dr. Rajesh Kumar",
    doctorSpecialty: "Orthopedist",
    doctorImage: "https://randomuser.me/api/portraits/men/62.jpg",
    date: "2023-06-20",
    time: "11:00 AM",
    type: "video",
    status: "completed",
    notes: "Follow-up in 2 weeks recommended."
  },
  {
    id: 102,
    doctorName: "Dr. Anjali Singh",
    doctorSpecialty: "Pediatrician",
    doctorImage: "https://randomuser.me/api/portraits/women/26.jpg",
    date: "2023-06-15",
    time: "9:30 AM",
    type: "video",
    status: "completed",
    notes: "Prescribed medication for 7 days."
  }
];

const AppointmentsPast = () => {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const isDoctor = userData?.role === "doctor";

  return (
    <div className="space-y-6">
      {pastAppointmentsData.length > 0 ? (
        pastAppointmentsData.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="hidden md:block">
                    <img
                      src={appointment.doctorImage}
                      alt={appointment.doctorName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      {isDoctor ? "Appointment with Patient" : appointment.doctorName}
                    </h3>
                    <p className="text-gray-500">{appointment.doctorSpecialty}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {appointment.time}
                      </span>
                      <span className="flex items-center">
                        {appointment.type === "video" ? (
                          <>
                            <Video className="mr-1 h-4 w-4" />
                            Video Consultation
                          </>
                        ) : (
                          <>
                            <MapPin className="mr-1 h-4 w-4" />
                            In-Person Visit
                          </>
                        )}
                      </span>
                    </div>
                    {appointment.notes && (
                      <p className="mt-2 text-sm italic">{appointment.notes}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 md:mt-0 space-y-2 md:space-y-0 flex flex-col md:flex-row md:space-x-2">
                  <Button variant="outline" className="w-full md:w-auto" asChild>
                    <Link to={`/appointments/${appointment.id}`}>View Details</Link>
                  </Button>
                  <Button variant="secondary" className="w-full md:w-auto" asChild>
                    <Link to="/appointments/book">Book Again</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg border-gray-200">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium">{t("appointments.noPast")}</h3>
          <p className="mt-1 text-gray-500">You haven't had any appointments yet</p>
          <Button className="mt-6" asChild>
            <Link to="/appointments/book">{t("appointments.book")}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPast;
