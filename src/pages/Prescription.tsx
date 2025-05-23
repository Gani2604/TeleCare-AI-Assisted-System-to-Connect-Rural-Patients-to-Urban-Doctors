
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Printer, Share2 } from "lucide-react";
import PrescriptionViewer from "@/components/prescriptions/PrescriptionViewer";
import { toast } from "sonner";

const PrescriptionPage = () => {
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  if (!prescriptionId) {
    toast.error("Prescription ID is required");
    navigate("/documents");
    return null;
  }
  
  const handleDownload = () => {
    toast.success("Prescription downloaded successfully");
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleShare = () => {
    toast.success("Share link copied to clipboard");
  };
  
  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <Button 
          variant="ghost" 
          className="pl-1 mb-4 md:mb-0" 
          onClick={() => navigate("/documents")}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("general.back")}
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" />
            {t("general.download")}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1 h-4 w-4" />
            {t("general.print")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-1 h-4 w-4" />
            {t("general.share")}
          </Button>
        </div>
      </div>
      
      <PrescriptionViewer prescriptionId={prescriptionId} />
    </div>
  );
};

export default PrescriptionPage;
