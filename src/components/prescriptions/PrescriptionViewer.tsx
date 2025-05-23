
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer, Share2, Lock } from "lucide-react";
import { toast } from "sonner";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface PrescriptionData {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorSpecialty: string;
  issueDate: string;
  medications: Medication[];
  notes?: string;
  followUpDate?: string;
}

interface PrescriptionViewerProps {
  prescriptionId: string;
}

const PrescriptionViewer = ({ prescriptionId }: PrescriptionViewerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock prescription data - in a real app, this would be fetched from an API
  const prescription: PrescriptionData = {
    id: prescriptionId,
    patientName: "John Doe",
    patientId: "P123456",
    doctorName: "Dr. Rajesh Patel",
    doctorSpecialty: "Dermatology",
    issueDate: "2023-04-10",
    medications: [
      {
        name: "Cetrizine",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "7 days",
        instructions: "Take after dinner"
      },
      {
        name: "Mometasone Furoate Cream",
        dosage: "Apply thin layer",
        frequency: "Twice daily",
        duration: "14 days",
        instructions: "Apply on affected areas only"
      }
    ],
    notes: "Avoid direct sunlight exposure. Keep affected areas clean and dry.",
    followUpDate: "2023-04-24"
  };
  
  const handleDownload = () => {
    setIsLoading(true);
    
    // Simulate download process with toast notification
    setTimeout(() => {
      setIsLoading(false);
      
      // Create a filename for the download
      const filename = `Prescription_${prescription.id}_${prescription.issueDate}.pdf`;
      
      // In a real app, this would generate and download a PDF
      // For this demo, we'll show a success message
      toast.success(`${filename} downloaded successfully`);
    }, 1500);
  };
  
  const handlePrint = () => {
    // Add a print-specific class to the body temporarily
    document.body.classList.add('printing-prescription');
    
    // Call the actual print method
    window.print();
    
    // Remove the print class after a short delay
    setTimeout(() => {
      document.body.classList.remove('printing-prescription');
    }, 1000);
    
    toast.success("Printing prescription...");
  };
  
  const handleShare = () => {
    // In a real app, this would open a share dialog or copy a link
    // For this demo, we'll simulate copying a link to clipboard
    
    // Create a shareable link (in a real app, this would be a unique URL)
    const shareableLink = `https://telecare.example.com/prescriptions/share/${prescription.id}`;
    
    // Show success message
    toast.success("Share link copied to clipboard", {
      description: "You can now paste the link to share this prescription",
      action: {
        label: "View Link",
        onClick: () => {
          toast.info(shareableLink);
        }
      }
    });
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Digital Prescription</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={isLoading}>
            <Download className="h-4 w-4 mr-1" />
            {isLoading ? "Downloading..." : "Download PDF"}
          </Button>
        </div>
      </div>
      
      <Card className="print:shadow-none">
        <CardHeader className="pb-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-telecare-600">TeleCare Prescription</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Rx ID: {prescription.id}</p>
            </div>
            <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
              <Lock className="h-3 w-3 mr-1" />
              Digitally Secured
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Patient Details</h3>
              <p className="font-medium">{prescription.patientName}</p>
              <p className="text-sm text-gray-600">ID: {prescription.patientId}</p>
              <p className="text-sm text-gray-600">Date: {prescription.issueDate}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Prescribed By</h3>
              <p className="font-medium">{prescription.doctorName}</p>
              <p className="text-sm text-gray-600">{prescription.doctorSpecialty}</p>
              <p className="text-sm text-gray-600">TeleCare Medical Network</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 pb-2 border-b">Medications</h3>
            <div className="space-y-4">
              {prescription.medications.map((med, index) => (
                <div key={index} className="pb-3 border-b last:border-0">
                  <div className="flex justify-between">
                    <p className="font-medium">{med.name}</p>
                    <p>{med.dosage}</p>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    <p>Take {med.frequency} for {med.duration}</p>
                    {med.instructions && <p className="mt-1">{med.instructions}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {prescription.notes && (
            <div>
              <h3 className="font-medium mb-2">Additional Notes</h3>
              <p className="text-gray-600">{prescription.notes}</p>
            </div>
          )}
          
          {prescription.followUpDate && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h3 className="font-medium mb-1">Follow-up Appointment</h3>
              <p className="text-gray-600">Please schedule a follow-up on {prescription.followUpDate}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4 text-sm text-gray-500">
          <p>This is a digital prescription issued through TeleCare</p>
          <p>Valid until: {new Date(new Date(prescription.issueDate).getTime() + 30*24*60*60*1000).toLocaleDateString()}</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PrescriptionViewer;
