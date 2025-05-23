
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { dbService } from "@/lib/db-service";

interface Appointment {
  id: number | string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

const AppointmentsUpcoming = () => {
  const { t } = useTranslation();
  const { userData, currentUser } = useAuth();
  const isDoctor = userData?.role === "doctor";
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // Check for locally saved appointments first (for immediate display after booking)
        const storedAppointments = localStorage.getItem('upcomingAppointments');
        if (storedAppointments) {
          const appointments = JSON.parse(storedAppointments);
          setUpcomingAppointments(appointments);
          setIsLoading(false);
          return;
        }
        
        // Fallback to the dummy data if no local storage data or for initial state
        setUpcomingAppointments([
          {
            id: 1,
            doctorName: "Dr. Sandeep Sharma",
            doctorSpecialty: "Cardiologist",
            doctorImage: "https://randomuser.me/api/portraits/men/32.jpg",
            date: "2025-07-10",
            time: "10:00 AM",
            type: "video",
            status: "confirmed",
          },
          {
            id: 2,
            doctorName: "Dr. Priya Patel",
            doctorSpecialty: "Dermatologist",
            doctorImage: "https://randomuser.me/api/portraits/women/44.jpg",
            date: "2025-07-15",
            time: "3:30 PM",
            type: "video",
            status: "confirmed",
          }
        ]);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  if (isLoading) {
    return <div className="py-4">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      {upcomingAppointments.length > 0 ? (
        upcomingAppointments.map((appointment) => (
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
                  </div>
                </div>

                <div className="mt-4 md:mt-0 space-y-2 md:space-y-0 flex flex-col md:flex-row md:space-x-2">
                  {appointment.type === "video" && (
                    <Button className="w-full md:w-auto" asChild>
                      <Link to={`/consultation-room/${appointment.id}`}>Join Now</Link>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full md:w-auto" asChild>
                    <Link to={`/appointments/${appointment.id}`}>View Details</Link>
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
          <h3 className="mt-4 text-lg font-medium">{t("appointments.noUpcoming")}</h3>
          <p className="mt-1 text-gray-500">Book an appointment to get started</p>
          <Button className="mt-6" asChild>
            <Link to="/appointments/book">{t("appointments.book")}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsUpcoming;
