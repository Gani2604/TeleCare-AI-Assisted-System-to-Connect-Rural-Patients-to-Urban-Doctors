
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUp, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabaseApi } from "@/lib/api";

interface DocumentUploadProps {
  type: "prescription" | "insurance" | "medical";
  onUploadComplete?: (fileData: FileData) => void;
}

export interface FileData {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  url: string;
  category: string;
}

const DocumentUpload = ({ type, onUploadComplete }: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (!category) {
      toast.error("Please select a document category");
      return;
    }
    
    setUploading(true);
    
    try {
      // Upload file to Supabase
      const uploadResult = await supabaseApi.documents.upload(file, type);
      
      // Save document metadata
      const sizeInKB = file.size / 1024;
      let sizeString = "";
      
      if (sizeInKB < 1024) {
        sizeString = `${sizeInKB.toFixed(1)} KB`;
      } else {
        sizeString = `${(sizeInKB / 1024).toFixed(1)} MB`;
      }
      
      const documentData = {
        name: file.name,
        documentType: type,
        fileName: uploadResult.fileName,
        fileSize: sizeString,
        fileType: file.type.split("/").pop()?.toUpperCase() || "PDF",
        category: category
      };
      
      const result = await supabaseApi.documents.create(documentData);
      
      const fileData: FileData = {
        id: result.id,
        name: file.name,
        type: file.type.split("/").pop()?.toUpperCase() || "PDF",
        size: sizeString,
        date: new Date().toISOString().split("T")[0],
        url: uploadResult.publicUrl,
        category: category,
      };
      
      if (onUploadComplete) {
        onUploadComplete(fileData);
      }
      
      setFile(null);
      setCategory("");
      toast.success("Document uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  
  const categoryOptions = {
    prescription: ["Medication", "Lab Result", "Doctor's Note", "Treatment Plan", "Specialist Referral"],
    insurance: ["Policy Document", "Claim Form", "ID Card", "Coverage Details", "Premium Receipt"],
    medical: ["Medical History", "Vaccination Record", "Hospital Discharge", "Surgery Report", "Allergy Information"],
  };
  
  const options = categoryOptions[type] || [];
  
  return (
    <div className="p-4 border rounded-lg bg-white space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document-type">Document Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="document-type">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="document-file">Upload File</Label>
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          {!file ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <FileUp className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <p>Drag and drop your file here, or click to browse</p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports PDF, JPEG, PNG (Max 10MB)
                </p>
              </div>
              <Input
                id="document-file"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("document-file")?.click()}
              >
                Browse Files
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium truncate max-w-[240px]">
                    {file.name}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setFile(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
