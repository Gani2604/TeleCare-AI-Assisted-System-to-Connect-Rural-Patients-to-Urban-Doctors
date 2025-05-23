import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUp, File, Download, Search, Filter, Calendar, CheckCircle } from "lucide-react";
import DocumentUpload, { FileData } from "@/components/documents/DocumentUpload";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabaseApi } from "@/lib/api";

interface Document {
  id: number | string;
  name: string;
  date: string;
  doctorName: string;
  type: string;
  size: string;
  url: string;
  category?: string;
}

// Date filter options
const dateFilters = [
  { label: "All Dates", value: "all" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 3 Months", value: "3months" },
  { label: "Last Year", value: "year" },
];

// Type filter options
const typeFilters = [
  { label: "All Types", value: "all" },
  { label: "PDF", value: "PDF" },
  { label: "Image", value: "Image" },
  { label: "Document", value: "Document" },
];

const DocumentsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // State for documents
  const [prescriptions, setPrescriptions] = useState<Document[]>([]);
  const [insuranceDocuments, setInsuranceDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        // Fetch prescription documents
        const prescriptionDocs = await supabaseApi.documents.getAll('prescription');
        setPrescriptions(prescriptionDocs.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          date: doc.created_at.split('T')[0],
          doctorName: doc.created_by || "System",
          type: doc.file_type,
          size: doc.file_size,
          url: doc.url,
          category: doc.category
        })));
        
        // Fetch insurance documents
        const insuranceDocs = await supabaseApi.documents.getAll('insurance');
        setInsuranceDocuments(insuranceDocs.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          date: doc.created_at.split('T')[0],
          doctorName: "N/A",
          type: doc.file_type,
          size: doc.file_size,
          url: doc.url,
          category: doc.category
        })));
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Failed to fetch documents. Please try again.");
        
        // Fallback to the dummy data if API fails
        setPrescriptions([
          {
            id: 1,
            name: "Blood Test Results",
            date: "2025-04-01",
            doctorName: "Dr. Sharma",
            type: "PDF",
            size: "1.2 MB",
            url: "#",
          },
          {
            id: 2,
            name: "Cardiology Report",
            date: "2025-03-15",
            doctorName: "Dr. Patel",
            type: "PDF",
            size: "2.4 MB",
            url: "#",
          },
          {
            id: 3,
            name: "Medication Schedule",
            date: "2025-02-28",
            doctorName: "Dr. Gupta",
            type: "PDF",
            size: "0.8 MB",
            url: "#",
          },
        ]);
        
        setInsuranceDocuments([
          {
            id: 1,
            name: "Health Insurance Policy",
            date: "2025-01-10",
            doctorName: "N/A",
            type: "PDF",
            size: "3.5 MB",
            url: "#",
          },
          {
            id: 2,
            name: "Insurance Claim Form",
            date: "2025-02-05",
            doctorName: "N/A",
            type: "PDF",
            size: "1.1 MB",
            url: "#",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Filter documents based on search query, date filter, and type filter
  const filterDocuments = (documents: Document[]) => {
    return documents.filter(doc => {
      // Search filter
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      const matchesType = typeFilter === "all" || doc.type === typeFilter;
      
      // Date filter
      let matchesDate = true;
      const docDate = new Date(doc.date);
      const now = new Date();
      
      if (dateFilter === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        matchesDate = docDate >= sevenDaysAgo;
      } else if (dateFilter === "30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        matchesDate = docDate >= thirtyDaysAgo;
      } else if (dateFilter === "3months") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        matchesDate = docDate >= threeMonthsAgo;
      } else if (dateFilter === "year") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        matchesDate = docDate >= oneYearAgo;
      }
      
      return matchesSearch && matchesType && matchesDate;
    });
  };

  const filteredPrescriptions = filterDocuments(prescriptions);
  const filteredInsurance = filterDocuments(insuranceDocuments);
  
  const handleDocumentUpload = async (fileData: FileData) => {
    const newDocument: Document = {
      id: fileData.id,
      name: fileData.name,
      date: fileData.date,
      doctorName: "Self-Uploaded",
      type: fileData.type,
      size: fileData.size,
      url: fileData.url,
      category: fileData.category,
    };
    
    if (activeTab === "prescriptions") {
      setPrescriptions((prev) => [newDocument, ...prev]);
    } else {
      setInsuranceDocuments((prev) => [newDocument, ...prev]);
    }
    
    setUploadDialogOpen(false);
    toast.success("Document uploaded successfully");
  };
  
  const handleViewPrescription = (id: number | string) => {
    navigate(`/prescriptions/${id}`);
  };

  const handleDownload = async (doc: Document) => {
    try {
      // Create a link element to download the file
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${doc.name} downloaded successfully`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download document. Please try again.");
    }
  };

  const handleResetFilters = () => {
    setDateFilter("all");
    setTypeFilter("all");
    setSearchQuery("");
  };

  const applyFilters = () => {
    setFilterDialogOpen(false);
    toast.success("Filters applied successfully");
  };

  return (
    <div className="telecare-container py-8">
      <h1 className="text-3xl font-bold mb-6">{t("documents.title")}</h1>

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t("documents.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-1 items-center">
                  <Filter className="h-4 w-4" />
                  {t("general.filter")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Filter Documents</DialogTitle>
                  <DialogDescription>
                    Select filters to narrow down your documents.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Date Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {dateFilters.map((filter) => (
                        <Button
                          key={filter.value}
                          variant={dateFilter === filter.value ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setDateFilter(filter.value)}
                        >
                          {filter.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Document Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {typeFilters.map((filter) => (
                        <Button
                          key={filter.value}
                          variant={typeFilter === filter.value ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setTypeFilter(filter.value)}
                        >
                          {filter.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                  <Button onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex gap-1 items-center">
                  <FileUp className="h-4 w-4" />
                  {t("documents.upload")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {activeTab === "prescriptions" 
                      ? t("documents.uploadPrescription") 
                      : t("documents.uploadInsurance")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("documents.uploadDescription")}
                  </DialogDescription>
                </DialogHeader>
                <DocumentUpload 
                  type={activeTab as "prescription" | "insurance"}
                  onUploadComplete={handleDocumentUpload} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="prescriptions">
              {t("documents.prescriptions")}
            </TabsTrigger>
            <TabsTrigger value="insurance">
              {t("documents.insurance")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("documents.prescriptions")}</CardTitle>
                <CardDescription>
                  {t("documents.prescriptionsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentsTable 
                  documents={filteredPrescriptions} 
                  onViewPrescription={handleViewPrescription}
                  onDownload={handleDownload}
                />
              </CardContent>
              {filteredPrescriptions.length > 0 && filteredPrescriptions.length !== prescriptions.length && (
                <CardFooter>
                  <div className="flex items-center text-sm text-gray-500">
                    <Filter className="h-4 w-4 mr-2" />
                    Showing {filteredPrescriptions.length} of {prescriptions.length} documents with current filters
                    <Button variant="link" className="ml-2 p-0 h-auto" onClick={handleResetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("documents.insurance")}</CardTitle>
                <CardDescription>
                  {t("documents.insuranceDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentsTable 
                  documents={filteredInsurance} 
                  onDownload={handleDownload}
                />
              </CardContent>
              {filteredInsurance.length > 0 && filteredInsurance.length !== insuranceDocuments.length && (
                <CardFooter>
                  <div className="flex items-center text-sm text-gray-500">
                    <Filter className="h-4 w-4 mr-2" />
                    Showing {filteredInsurance.length} of {insuranceDocuments.length} documents with current filters
                    <Button variant="link" className="ml-2 p-0 h-auto" onClick={handleResetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface DocumentsTableProps {
  documents: Document[];
  onViewPrescription?: (id: number | string) => void;
  onDownload: (doc: Document) => void;
}

const DocumentsTable = ({ documents, onViewPrescription, onDownload }: DocumentsTableProps) => {
  const { t } = useTranslation();

  if (documents.length === 0) {
    return (
      <div className="py-8 text-center">
        <File className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          {t("documents.noDocuments")}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {t("documents.uploadNew")}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("documents.name")}</TableHead>
          <TableHead>{t("documents.date")}</TableHead>
          <TableHead>{t("documents.provider")}</TableHead>
          <TableHead>{t("documents.type")}</TableHead>
          <TableHead>{t("documents.size")}</TableHead>
          <TableHead>{t("general.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium">{doc.name}</TableCell>
            <TableCell>{doc.date}</TableCell>
            <TableCell>{doc.doctorName}</TableCell>
            <TableCell>{doc.type}</TableCell>
            <TableCell>{doc.size}</TableCell>
            <TableCell className="space-x-2">
              {doc.doctorName !== "N/A" && onViewPrescription && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onViewPrescription(doc.id)}
                >
                  View
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onDownload(doc)}
              >
                <Download className="h-4 w-4 mr-1" />
                {t("general.download")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DocumentsPage;
