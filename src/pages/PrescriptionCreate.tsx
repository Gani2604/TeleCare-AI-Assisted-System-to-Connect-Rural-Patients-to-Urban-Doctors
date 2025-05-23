
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { ChevronLeft, Plus, X } from "lucide-react";

const PrescriptionCreate = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[]>([
    { id: "1", name: "", dosage: "", frequency: "", duration: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddMedication = () => {
    setMedications([...medications, {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      duration: ""
    }]);
  };
  
  const handleRemoveMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    } else {
      toast.error("Prescription must include at least one medication");
    }
  };
  
  const handleMedicationChange = (id: string, field: string, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientName) {
      toast.error("Patient name is required");
      return;
    }
    
    if (medications.some(med => !med.name || !med.dosage || !med.frequency)) {
      toast.error("Complete all medication details");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would make an API call to save the prescription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Prescription created successfully");
      navigate("/consultations");
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error("Failed to create prescription");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if user is a doctor
  if (userData?.role !== "doctor") {
    return (
      <div className="telecare-container py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600">Only doctors can create prescriptions.</p>
          <Button className="mt-6" onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        <div>
          <Button 
            variant="ghost" 
            className="mb-4 pl-1" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create Prescription</h1>
          <p className="mt-2 text-gray-600">
            Add details and medications for the patient's prescription
          </p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name*</Label>
                  <Input 
                    id="patientName" 
                    value={patientName} 
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientAge">Patient Age</Label>
                  <Input 
                    id="patientAge" 
                    value={patientAge} 
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="Enter patient age"
                    type="number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input 
                  id="diagnosis" 
                  value={diagnosis} 
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Medications*</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddMedication}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Medication
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {medications.map((medication, index) => (
                    <div key={medication.id} className="border rounded-md p-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6"
                        onClick={() => handleRemoveMedication(medication.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`medication-name-${index}`}>Medication Name*</Label>
                          <Input 
                            id={`medication-name-${index}`}
                            value={medication.name}
                            onChange={(e) => handleMedicationChange(medication.id, "name", e.target.value)}
                            placeholder="Enter medication name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`medication-dosage-${index}`}>Dosage*</Label>
                          <Input 
                            id={`medication-dosage-${index}`}
                            value={medication.dosage}
                            onChange={(e) => handleMedicationChange(medication.id, "dosage", e.target.value)}
                            placeholder="e.g., 500mg"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`medication-frequency-${index}`}>Frequency*</Label>
                          <Input 
                            id={`medication-frequency-${index}`}
                            value={medication.frequency}
                            onChange={(e) => handleMedicationChange(medication.id, "frequency", e.target.value)}
                            placeholder="e.g., Twice daily"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`medication-duration-${index}`}>Duration</Label>
                          <Input 
                            id={`medication-duration-${index}`}
                            value={medication.duration}
                            onChange={(e) => handleMedicationChange(medication.id, "duration", e.target.value)}
                            placeholder="e.g., 7 days"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes and Instructions</Label>
                <Textarea 
                  id="notes" 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any additional instructions or notes"
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : "Create Prescription"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PrescriptionCreate;
