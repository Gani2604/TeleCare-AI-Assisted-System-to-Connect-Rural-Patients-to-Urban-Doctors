
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Search, User, Video, CheckCircle, XCircle, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Types for appointments
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhoto?: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  type: 'video' | 'in-person';
  purpose: string;
}

const DoctorAppointmentsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        
        // Mock data - in a real app, this would come from your backend
        const mockAppointments: Appointment[] = [
          {
            id: "a1",
            patientId: "p1",
            patientName: "Rahul Sharma",
            patientPhoto: "https://randomuser.me/api/portraits/men/32.jpg",
            date: new Date().toISOString().split('T')[0], // Today
            time: "10:00 AM",
            status: "confirmed",
            type: "video",
            purpose: "Follow-up consultation for hypertension medication"
          },
          {
            id: "a2",
            patientId: "p2",
            patientName: "Priya Patel",
            patientPhoto: "https://randomuser.me/api/portraits/women/44.jpg",
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            time: "2:30 PM",
            status: "confirmed",
            type: "video",
            purpose: "Initial consultation for recurring headaches"
          },
          {
            id: "a3",
            patientId: "p3",
            patientName: "Ananya Desai",
            date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], // 3 days ago
            time: "11:15 AM",
            status: "completed",
            type: "video",
            purpose: "Diabetes management review"
          },
          {
            id: "a4",
            patientId: "p4",
            patientName: "Vikram Singh",
            patientPhoto: "https://randomuser.me/api/portraits/men/45.jpg",
            date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // 1 day ago
            time: "4:00 PM",
            status: "cancelled",
            type: "in-person",
            purpose: "Annual physical examination"
          }
        ];
        
        setAppointments(mockAppointments);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments");
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group appointments by status
  const upcomingAppointments = filteredAppointments.filter(a => a.status === "confirmed");
  const completedAppointments = filteredAppointments.filter(a => a.status === "completed");
  const cancelledAppointments = filteredAppointments.filter(a => a.status === "cancelled");
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderAppointmentList = (appointmentList: Appointment[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-telecare-500"></div>
        </div>
      );
    }

    if (appointmentList.length === 0) {
      return (
        <div className="text-center py-12 border border-dashed rounded-md border-gray-200">
          <p className="text-gray-500">No appointments found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {appointmentList.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {appointment.patientPhoto ? (
                      <img src={appointment.patientPhoto} alt={appointment.patientName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{appointment.patientName}</h3>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(appointment.date)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {appointment.time}
                      </span>
                      <span className="flex items-center">
                        {appointment.type === "video" ? (
                          <Video className="h-4 w-4 mr-1" />
                        ) : (
                          <User className="h-4 w-4 mr-1" />
                        )}
                        {appointment.type === "video" ? "Video" : "In-person"}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status === 'confirmed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {appointment.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                        {appointment.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{appointment.purpose}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {appointment.status === "confirmed" && (
                    <Button asChild>
                      <Link to={`/consultation-room/${appointment.id}`}>Start Consultation</Link>
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link to={`/patients/${appointment.patientId}`}>View Patient</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("appointments.title")}</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search appointments by patient name or purpose"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledAppointments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {renderAppointmentList(upcomingAppointments)}
          </TabsContent>
          
          <TabsContent value="completed">
            {renderAppointmentList(completedAppointments)}
          </TabsContent>
          
          <TabsContent value="cancelled">
            {renderAppointmentList(cancelledAppointments)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
