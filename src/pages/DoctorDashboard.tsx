import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { Calendar, Video, FileText, Clock, User, MessageSquare, Bell, Upload, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PatientAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhoto?: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  type: 'video' | 'in-person';
  notes?: string;
}

interface PatientRecord {
  id: string;
  patientId: string;
  patientName: string;
  lastVisit: string;
  condition: string;
  recentUpdates: string;
}

interface PatientPrescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  description: string;
}

const DoctorDashboard = () => {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<PatientRecord[]>([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState<PatientPrescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setIsLoading(true);
        
        const mockAppointments: PatientAppointment[] = [
          {
            id: "1",
            patientId: "p1",
            patientName: "Rahul Sharma",
            patientPhoto: "https://randomuser.me/api/portraits/men/32.jpg",
            date: new Date().toISOString().split('T')[0],
            time: "10:00 AM",
            status: "confirmed",
            type: "video",
            notes: "Follow-up consultation"
          },
          {
            id: "2",
            patientId: "p2",
            patientName: "Priya Patel",
            patientPhoto: "https://randomuser.me/api/portraits/women/44.jpg",
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            time: "2:30 PM",
            status: "confirmed",
            type: "video",
            notes: "Initial consultation for headaches"
          }
        ];

        const mockPatientRecords: PatientRecord[] = [
          {
            id: "r1",
            patientId: "p1",
            patientName: "Rahul Sharma",
            lastVisit: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
            condition: "Hypertension",
            recentUpdates: "Blood pressure has improved with medication"
          },
          {
            id: "r2",
            patientId: "p3",
            patientName: "Ananya Desai",
            lastVisit: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
            condition: "Type 2 Diabetes",
            recentUpdates: "HbA1c levels decreased from 8.2 to 7.1"
          }
        ];

        const mockPrescriptions: PatientPrescription[] = [
          {
            id: "px1",
            patientId: "p1",
            patientName: "Rahul Sharma",
            date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
            description: "Amlodipine 5mg - Once daily for hypertension"
          },
          {
            id: "px2",
            patientId: "p3",
            patientName: "Ananya Desai",
            date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
            description: "Metformin 500mg - Twice daily for diabetes"
          }
        ];
        
        setAppointments(mockAppointments);
        setRecentPatients(mockPatientRecords);
        setPatientPrescriptions(mockPrescriptions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        toast.error("Failed to load dashboard data");
        setIsLoading(false);
      }
    };
    
    fetchDoctorData();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("dashboard.welcome", { name: userData?.name || "Doctor" })}
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your appointments and patient consultations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-telecare-600">
                {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Pending Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent-400">2</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">New Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-highlight-400">5</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Patient Records Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">12</div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-telecare-100 rounded-lg flex items-center justify-center mb-2">
                  <Video className="h-5 w-5 text-telecare-600" />
                </div>
                <CardTitle>Start Consultation</CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/consultations">Join Call</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mb-2">
                  <FileText className="h-5 w-5 text-accent-400" />
                </div>
                <CardTitle>Create Prescription</CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/prescription/new">Create</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-highlight-100 rounded-lg flex items-center justify-center mb-2">
                  <Edit className="h-5 w-5 text-highlight-400" />
                </div>
                <CardTitle>Manage Patients</CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/patients">View Patients</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <CardTitle>Appointments</CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/doctor/appointments">View All</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/doctor/appointments">View All Appointments</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <Card>
                <CardContent className="h-24 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-telecare-500"></div>
                </CardContent>
              </Card>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
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
                          <h3 className="font-medium">
                            Appointment with {appointment.patientName}
                          </h3>
                          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDate(appointment.date)}, {appointment.time}
                            </span>
                            <span className="flex items-center">
                              <Video className="h-4 w-4 mr-1" />
                              Video Consultation
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button asChild>
                          <Link to={`/consultation-room/${appointment.id}`}>Start</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to={`/patients/${appointment.patientId}`}>View Records</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 border border-dashed rounded-md border-gray-200">
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Patients</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/patients">View All Patients</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentPatients.map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <CardTitle>{patient.patientName}</CardTitle>
                  <CardDescription>Last visit: {formatDate(patient.lastVisit)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Condition:</span> {patient.condition}
                    </div>
                    <div>
                      <span className="font-medium">Recent Updates:</span> {patient.recentUpdates}
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold mb-2">Documents</h3>
                      <div className="space-y-2">
                        {patientPrescriptions
                          .filter(p => p.patientId === patient.patientId)
                          .map(prescription => (
                            <div key={prescription.id} className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">Prescription: {formatDate(prescription.date)}</p>
                                <p className="text-xs text-gray-500 truncate max-w-xs">{prescription.description}</p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/prescriptions/${prescription.id}`}>View</Link>
                              </Button>
                            </div>
                          ))}
                        {patientPrescriptions.filter(p => p.patientId === patient.patientId).length === 0 && (
                          <p className="text-sm text-gray-500">No documents available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link to={`/patients/${patient.patientId}/edit`}>Update Records</Link>
                  </Button>
                  <Button asChild>
                    <Link to={`/prescription/new?patientId=${patient.patientId}`}>Write Prescription</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Button asChild variant="outline">
              <Link to="/features">Learn More About TeleCare Features</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
