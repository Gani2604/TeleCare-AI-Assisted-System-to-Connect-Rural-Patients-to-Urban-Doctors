
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Send, Paperclip } from "lucide-react";
import VideoConsultation from "@/components/consultations/VideoConsultation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock consultation data
const consultationsData = {
  "1": {
    id: "1",
    doctorName: "Dr. Priya Sharma",
    patientName: "Rahul Kumar",
    specialization: "Cardiology",
    date: "2023-04-15",
    time: "10:00 AM",
    status: "upcoming",
  },
  "2": {
    id: "2",
    doctorName: "Dr. Rajesh Patel",
    patientName: "Anita Singh",
    specialization: "Dermatology",
    date: "2023-04-10",
    time: "2:30 PM",
    status: "completed",
  },
  // Add more consultations as needed
};

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isFile?: boolean;
  fileUrl?: string;
  fileName?: string;
}

const ConsultationRoom = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(true);
  const [isInRoom, setIsInRoom] = useState(false);
  const { userData } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  
  // For debugging purposes
  useEffect(() => {
    console.log("User role in consultation room:", userData?.role);
  }, [userData]);
  
  const consultation = consultationId ? consultationsData[consultationId as keyof typeof consultationsData] : null;
  
  useEffect(() => {
    if (!consultation) {
      toast.error("Consultation not found");
      navigate("/consultations");
      return;
    }
    
    // Simulate joining process
    const timer = setTimeout(() => {
      setIsJoining(false);
      setIsInRoom(true);
      // In a real app, this would establish the actual connection
      
      // Add welcome message
      setMessages([
        {
          id: "system-1",
          sender: "System",
          content: `Welcome to the consultation between ${consultation.doctorName} and ${consultation.patientName}`,
          timestamp: new Date(),
        }
      ]);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [consultation, navigate]);
  
  const handleEndConsultation = () => {
    navigate("/consultations");
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "" && !fileUpload) return;
    
    if (newMessage.trim() !== "") {
      const message: Message = {
        id: `msg-${Date.now()}`,
        sender: userData?.name || "User",
        content: newMessage,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
    
    if (fileUpload) {
      handleFileUpload();
    }
  };
  
  const handleFileUpload = () => {
    if (!fileUpload) return;
    
    // In a real app, this would upload the file to storage
    // and return a URL to download it
    const fileMessage: Message = {
      id: `file-${Date.now()}`,
      sender: userData?.name || "User",
      content: `Shared a file: ${fileUpload.name}`,
      timestamp: new Date(),
      isFile: true,
      fileName: fileUpload.name,
      // In a real app, this would be the actual file URL
      fileUrl: URL.createObjectURL(fileUpload),
    };
    
    setMessages((prev) => [...prev, fileMessage]);
    setFileUpload(null);
    
    // Reset the file input
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUpload(e.target.files[0]);
      toast.success(`File "${e.target.files[0].name}" ready to send`);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (!consultation) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="telecare-container py-8 flex flex-col gap-6">
      <div>
        <Button 
          variant="ghost" 
          className="mb-4 pl-1" 
          onClick={() => navigate("/consultations")}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Consultations
        </Button>
      </div>
      
      {isJoining && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telecare-500 mb-4"></div>
          <p className="text-lg">Joining consultation with {userData?.role === "doctor" ? consultation.patientName : consultation.doctorName}...</p>
          <p className="text-sm text-gray-500 mt-2">Please ensure your camera and microphone are working</p>
        </div>
      )}
      
      {isInRoom && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video consultation takes 2/3 of the space on large screens */}
          <div className="lg:col-span-2">
            <VideoConsultation 
              consultationId={consultation.id} 
              doctorName={consultation.doctorName}
              patientName={consultation.patientName}
              onEnd={handleEndConsultation}
            />
          </div>
          
          {/* Chat and file sharing takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Consultation Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <ScrollArea className="flex-grow h-[400px] mb-4">
                  <div className="space-y-4 p-1">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex flex-col ${
                          message.sender === "System" 
                            ? "items-center" 
                            : message.sender === userData?.name 
                              ? "items-end" 
                              : "items-start"
                        }`}
                      >
                        <div className={`px-4 py-2 rounded-lg max-w-[80%] ${
                          message.sender === "System" 
                            ? "bg-gray-100 text-gray-600" 
                            : message.sender === userData?.name 
                              ? "bg-telecare-100 text-telecare-700" 
                              : "bg-gray-200 text-gray-800"
                        }`}>
                          {message.sender !== "System" && (
                            <p className="text-xs font-semibold mb-1">{message.sender}</p>
                          )}
                          <p>{message.content}</p>
                          {message.isFile && message.fileUrl && (
                            <a 
                              href={message.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm text-blue-600 underline mt-1 block"
                            >
                              Download {message.fileName}
                            </a>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="mt-auto">
                  {fileUpload && (
                    <div className="bg-gray-100 p-2 rounded mb-2 text-sm flex items-center justify-between">
                      <span className="truncate max-w-[80%]">{fileUpload.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setFileUpload(null)}
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="flex-grow"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationRoom;
