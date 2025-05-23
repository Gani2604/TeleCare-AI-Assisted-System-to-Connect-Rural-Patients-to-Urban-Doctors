
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video, User, Phone, Mail, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

interface AppointmentDetails {
  id: string | number;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  doctorContact?: string;
  doctorEmail?: string;
  date: string;
  time: string;
  type: string;
  status: string;
  reason?: string;
  symptoms?: string;
}

const AppointmentDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      setIsLoading(true);
      try {
        // First check localStorage for appointment data (for demonstration purposes)
        const storedAppointments = localStorage.getItem('upcomingAppointments');
        if (storedAppointments) {
          const appointments = JSON.parse(storedAppointments);
          const foundAppointment = appointments.find((apt: AppointmentDetails) => 
            apt.id.toString() === id
          );
          
          if (foundAppointment) {
            // Add some mock additional details for demonstration
            const enhancedAppointment = {
              ...foundAppointment,
              doctorContact: "+91 9876543210",
              doctorEmail: `${foundAppointment.doctorName.toLowerCase().replace(/\s+/g, '.')}@telecare.com`,
              reason: "Regular checkup and medication review",
              symptoms: "Mild fever, headache, and fatigue for the past 3 days"
            };
            setAppointment(enhancedAppointment);
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback to mock data if no appointment is found in localStorage
        // In a real application, this would be an API call to fetch the appointment details
        const mockAppointment: AppointmentDetails = {
          id: id || "1",
          doctorName: "Dr. Sandeep Sharma",
          doctorSpecialty: "Cardiologist",
          doctorImage: "https://randomuser.me/api/portraits/men/32.jpg",
          doctorContact: "+91 9876543210",
          doctorEmail: "sandeep.sharma@telecare.com",
          date: "2025-07-10",
          time: "10:00 AM",
          type: "video",
          status: "confirmed",
          reason: "Regular checkup and medication review",
          symptoms: "Mild fever, headache, and fatigue for the past 3 days"
        };
        
        setAppointment(mockAppointment);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast.error("Failed to load appointment details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAppointmentDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="telecare-container py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="telecare-container py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold">{t("appointments.notFound")}</h2>
              <p className="text-gray-500 mt-2">The appointment you're looking for doesn't exist or has been removed.</p>
              <Button className="mt-6" asChild>
                <Link to="/appointments">{t("general.goBack")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="telecare-container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("appointments.details")}</h1>
        <Button variant="outline" asChild>
          <Link to="/appointments">{t("general.goBack")}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("appointments.details")}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <img
                  src={appointment.doctorImage}
                  alt={appointment.doctorName}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold">{appointment.doctorName}</h2>
                  <p className="text-gray-500">{appointment.doctorSpecialty}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{t("appointments.date")}</p>
                      <p>{new Date(appointment.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{t("appointments.time")}</p>
                      <p>{appointment.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    {appointment.type === "video" ? (
                      <Video className="h-5 w-5 text-gray-500 mt-0.5" />
                    ) : (
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{t("appointments.type")}</p>
                      <p>
                        {appointment.type === "video"
                          ? t("appointments.videoConsultation")
                          : t("appointments.inPersonVisit")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{t("appointments.status")}</p>
                      <p className="capitalize">{appointment.status}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{t("general.contact")}</p>
                      <p>{appointment.doctorContact || t("general.notAvailable")}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{t("general.email")}</p>
                      <p>{appointment.doctorEmail || t("general.notAvailable")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("appointments.reason")}</p>
                    <p>{appointment.reason || t("general.notProvided")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("appointments.symptoms")}</p>
                    <p>{appointment.symptoms || t("general.notProvided")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("appointments.actions")}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {appointment.type === "video" && appointment.status === "confirmed" && (
                <Button className="w-full" asChild>
                  <Link to={`/consultation-room/${appointment.id}`}>
                    <Video className="h-4 w-4 mr-2" />
                    {t("appointments.joinNow")}
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/appointments">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("appointments.viewAll")}
                </Link>
              </Button>
              
              <Button variant="secondary" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                {t("general.callDoctor")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
