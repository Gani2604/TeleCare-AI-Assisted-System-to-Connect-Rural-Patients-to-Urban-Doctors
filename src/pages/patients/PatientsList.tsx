
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { FileText, Search, User } from "lucide-react";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  lastVisit: string;
  photo?: string;
}

const PatientsList = () => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        
        // Mock data - in a real app, this would come from your backend
        const mockPatients: Patient[] = [
          {
            id: "p1",
            name: "Rahul Sharma",
            age: 42,
            gender: "Male",
            condition: "Hypertension",
            lastVisit: new Date(Date.now() - 7 * 86400000).toISOString(),
            photo: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          {
            id: "p2",
            name: "Priya Patel",
            age: 35,
            gender: "Female",
            condition: "Migraine",
            lastVisit: new Date(Date.now() - 3 * 86400000).toISOString(),
            photo: "https://randomuser.me/api/portraits/women/44.jpg"
          },
          {
            id: "p3",
            name: "Ananya Desai",
            age: 58,
            gender: "Female",
            condition: "Type 2 Diabetes",
            lastVisit: new Date(Date.now() - 14 * 86400000).toISOString()
          }
        ];
        
        setPatients(mockPatients);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patients");
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Patients</h1>
          <Button asChild>
            <Link to="/patients/new">Add New Patient</Link>
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search patients by name or condition"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-telecare-500"></div>
          </div>
        ) : filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {patient.photo ? (
                        <img src={patient.photo} alt={patient.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <CardDescription>{patient.age} years, {patient.gender}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Condition:</span> {patient.condition}
                  </div>
                  <div>
                    <span className="font-medium">Last Visit:</span> {formatDate(patient.lastVisit)}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link to={`/patients/${patient.id}`}>
                      View Details
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-md border-gray-200">
            <p className="text-gray-500">No patients found matching your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsList;
