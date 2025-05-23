
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, Edit, FileText, MessageSquare, Video } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
  condition: string;
  allergies?: string[];
  medicalHistory?: string;
  lastVisit: string;
  photo?: string;
}

interface Prescription {
  id: string;
  patientId: string;
  date: string;
  description: string;
}

const PatientDetails = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) {
        toast.error("Patient ID is required");
        navigate("/patients");
        return;
      }

      try {
        setIsLoading(true);
        
        // Mock patient data - in a real app, fetch from API
        const mockPatient: Patient = {
          id: patientId,
          name: patientId === "p1" ? "Rahul Sharma" : patientId === "p2" ? "Priya Patel" : "Ananya Desai",
          age: patientId === "p1" ? 42 : patientId === "p2" ? 35 : 58,
          gender: patientId === "p2" ? "Female" : patientId === "p3" ? "Female" : "Male",
          email: "patient@example.com",
          phone: "+91 9876543210",
          address: "123 Main Street, Mumbai, Maharashtra",
          condition: patientId === "p1" ? "Hypertension" : patientId === "p2" ? "Migraine" : "Type 2 Diabetes",
          allergies: ["Penicillin", "Peanuts"],
          medicalHistory: "Patient has a history of high blood pressure for the past 5 years. Currently on medication.",
          lastVisit: new Date(Date.now() - 7 * 86400000).toISOString(),
          photo: patientId === "p1" ? "https://randomuser.me/api/portraits/men/32.jpg" : 
                 patientId === "p2" ? "https://randomuser.me/api/portraits/women/44.jpg" : undefined
        };

        // Mock prescriptions
        const mockPrescriptions: Prescription[] = [
          {
            id: "px1",
            patientId,
            date: new Date(Date.now() - 7 * 86400000).toISOString(),
            description: patientId === "p1" ? "Amlodipine 5mg - Once daily for hypertension" : 
                         patientId === "p2" ? "Sumatriptan 50mg - As needed for migraine" : 
                         "Metformin 500mg - Twice daily for diabetes"
          },
          {
            id: "px2",
            patientId,
            date: new Date(Date.now() - 30 * 86400000).toISOString(),
            description: "Vitamin D3 60000 IU - Once weekly for 8 weeks"
          }
        ];
        
        setPatient(mockPatient);
        setPrescriptions(mockPrescriptions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast.error("Failed to load patient details");
        setIsLoading(false);
      }
    };
    
    fetchPatientData();
  }, [patientId, navigate]);

  if (isLoading) {
    return (
      <div className="telecare-container py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-telecare-500"></div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="telecare-container py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Patient not found</p>
          <Button variant="outline" asChild className="mt-4">
            <Link to="/patients">Back to Patients</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-4" onClick={() => navigate("/patients")}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Patients
          </Button>
          <h1 className="text-3xl font-bold">Patient Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {patient.photo ? (
                        <img src={patient.photo} alt={patient.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-gray-500">
                          {patient.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{patient.name}</CardTitle>
                      <CardDescription>
                        {patient.age} years, {patient.gender}
                      </CardDescription>
                    </div>
                  </div>
                  <Button asChild>
                    <Link to={`/patients/${patient.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                    <div className="space-y-2 mt-2">
                      {patient.email && (
                        <p className="text-sm">
                          <span className="font-medium">Email:</span> {patient.email}
                        </p>
                      )}
                      {patient.phone && (
                        <p className="text-sm">
                          <span className="font-medium">Phone:</span> {patient.phone}
                        </p>
                      )}
                      {patient.address && (
                        <p className="text-sm">
                          <span className="font-medium">Address:</span> {patient.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Medical Information</h3>
                    <div className="space-y-2 mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Condition:</span> {patient.condition}
                      </p>
                      {patient.allergies && patient.allergies.length > 0 && (
                        <p className="text-sm">
                          <span className="font-medium">Allergies:</span> {patient.allergies.join(", ")}
                        </p>
                      )}
                      <p className="text-sm">
                        <span className="font-medium">Last Visit:</span> {formatDate(patient.lastVisit)}
                      </p>
                    </div>
                  </div>
                </div>

                {patient.medicalHistory && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Medical History</h3>
                    <p className="text-sm mt-2">{patient.medicalHistory}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/consultation-room/new?patientId=${patient.id}`}>
                    <Video className="h-4 w-4 mr-2" />
                    Start Consultation
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/medical-chat?patientId=${patient.id}`}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Link>
                </Button>
                <Button asChild>
                  <Link to={`/prescription/new?patientId=${patient.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    Write Prescription
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Prescriptions and medical files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptions.length > 0 ? (
                    prescriptions.map((prescription) => (
                      <div key={prescription.id} className="p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">Prescription</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(prescription.date)}</p>
                            <p className="text-sm mt-2 text-gray-700">{prescription.description}</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/prescriptions/${prescription.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No documents available</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to={`/prescription/new?patientId=${patient.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    New Prescription
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
