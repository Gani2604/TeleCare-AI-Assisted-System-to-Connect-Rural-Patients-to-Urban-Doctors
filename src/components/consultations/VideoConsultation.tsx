
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, PaperclipIcon, Send, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { JitsiMeeting } from '@jitsi/react-sdk';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface VideoConsultationProps {
  consultationId: string;
  doctorName: string;
  patientName?: string;
  onEnd?: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const VideoConsultation = ({ consultationId, doctorName, patientName, onEnd }: VideoConsultationProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("video");
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [sharedFiles, setSharedFiles] = useState<{ id: string; name: string; sender: string; url: string; timestamp: Date }[]>([]);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jitsiApiRef = useRef<any>(null);
  
  const { userData } = useAuth();
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Generate a deterministic room name based on consultation ID
  const getRoomName = () => {
    return `telecare-consultation-${consultationId}`;
  };
  
  // Handle jitsi API ready
  const handleJitsiIFrameReady = (apiObj: any) => {
    jitsiApiRef.current = apiObj;
    
    // Set up event listeners
    apiObj.addListener('videoConferenceJoined', () => {
      setIsConnected(true);
      toast.success("Connected to consultation");
    });
    
    apiObj.addListener('videoConferenceLeft', () => {
      if (onEnd) onEnd();
    });
    
    // Timer for call duration
    const timer = window.setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(timer);
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  };
  
  const toggleMute = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleAudio');
      setIsMuted(!isMuted);
      toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
    }
  };
  
  const toggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleVideo');
      setIsVideoOn(!isVideoOn);
      toast.info(isVideoOn ? "Camera turned off" : "Camera turned on");
    }
  };
  
  const endCall = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('hangup');
    }
    
    toast.info("Consultation ended");
    if (onEnd) onEnd();
  };
  
  const sendChatMessage = () => {
    if (newMessage.trim() === "") return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: userData?.name || "You",
      content: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, message]);
    setNewMessage("");
    
    // In a real app, this would send the message through the Jitsi API or your backend
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // In a real app, this would upload the file to your storage
      // For demo purposes, we'll just add it to the shared files list
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        sender: userData?.name || "You",
        url: URL.createObjectURL(file),
        timestamp: new Date()
      };
      
      setSharedFiles([...sharedFiles, newFile]);
      toast.success(`File "${file.name}" shared`);
      setIsFileDialogOpen(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get display name for Jitsi
  const getDisplayName = () => {
    return userData?.name || (userData?.role === "doctor" ? "Doctor" : "Patient");
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div>
            Consultation with {userData?.role === "doctor" ? patientName : doctorName}
          </div>
          <div className="flex items-center gap-2 text-sm font-normal">
            {isConnected ? (
              <>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Connected</span>
                <span className="ml-2">{formatTime(elapsedTime)}</span>
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                <span>Connecting...</span>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="video">Video Call</TabsTrigger>
            <TabsTrigger value="chat">Chat & Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="video" className="m-0">
            <div className="h-[60vh] overflow-hidden">
              <JitsiMeeting
                domain="meet.jit.si"
                roomName={getRoomName()}
                configOverwrite={{
                  startWithAudioMuted: false,
                  startWithVideoMuted: false,
                  enableClosePage: false,
                  disableInviteFunctions: true,
                  toolbarButtons: [
                    'microphone', 'camera', 'chat', 'desktop', 'hangup'
                  ]
                }}
                interfaceConfigOverwrite={{
                  HIDE_INVITE_MORE_HEADER: true,
                  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                  DEFAULT_BACKGROUND: '#FFFFFF'
                }}
                userInfo={{
                  displayName: getDisplayName(),
                  email: userData?.email || undefined
                }}
                getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; }}
                onApiReady={handleJitsiIFrameReady}
                spinner={SpinnerComponent}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="m-0 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="border rounded-md h-96 flex flex-col">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">Chat</h3>
                  </div>
                  <div 
                    className="flex-1 overflow-y-auto p-4 space-y-4" 
                    ref={chatContainerRef}
                  >
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No messages yet.</p>
                        <p className="text-sm">Send a message to start the conversation</p>
                      </div>
                    ) : (
                      chatMessages.map((message) => (
                        <div 
                          key={message.id}
                          className={`flex flex-col ${message.sender === (userData?.name || "You") ? 'items-end' : 'items-start'}`}
                        >
                          <div className={`px-3 py-2 rounded-lg max-w-[80%] ${
                            message.sender === (userData?.name || "You") 
                              ? 'bg-telecare-100 text-telecare-700' 
                              : 'bg-gray-100'
                          }`}>
                            <p>{message.content}</p>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <span>{message.sender}</span>
                            <span>·</span>
                            <span>{message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t">
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Type a message..." 
                        className="min-h-0"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendChatMessage();
                          }
                        }}
                      />
                      <div className="flex gap-1">
                        <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon" title="Share file">
                              <PaperclipIcon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Share a file</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <Input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileUpload}
                              />
                              <p className="text-sm text-muted-foreground mt-2">
                                Max file size: 10MB. Supported formats: PDF, DOC, JPG, PNG
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="icon" onClick={sendChatMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="border rounded-md h-96 flex flex-col">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">Shared Files</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {sharedFiles.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <PaperclipIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No files shared</p>
                        <p className="text-sm">Use the paperclip icon to share files</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {sharedFiles.map((file) => (
                          <div key={file.id} className="border rounded p-3">
                            <div className="flex items-center gap-2">
                              <FileIcon extension={file.name.split('.').pop() || ""} />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{file.sender}</p>
                              </div>
                              <Button size="sm" variant="ghost" asChild>
                                <a href={file.url} download={file.name}>
                                  Download
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center gap-4 pt-4">
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${isMuted ? 'bg-red-100' : ''}`}
          onClick={toggleMute}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full ${!isVideoOn ? 'bg-red-100' : ''}`}
          onClick={toggleVideo}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full"
          onClick={endCall}
        >
          <Phone className="h-5 w-5 rotate-225" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper components
const SpinnerComponent = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telecare-500 mb-4"></div>
    <p className="text-lg">Joining consultation...</p>
  </div>
);

const FileIcon = ({ extension }: { extension: string }) => {
  let icon = "h-10 w-10 text-gray-400";
  let bg = "bg-gray-100";
  
  switch (extension.toLowerCase()) {
    case 'pdf':
      icon = "h-10 w-10 text-red-500";
      bg = "bg-red-50";
      break;
    case 'doc':
    case 'docx':
      icon = "h-10 w-10 text-blue-500";
      bg = "bg-blue-50";
      break;
    case 'jpg':
    case 'jpeg':
    case 'png':
      icon = "h-10 w-10 text-green-500";
      bg = "bg-green-50";
      break;
  }
  
  return (
    <div className={`${bg} w-10 h-10 rounded flex items-center justify-center`}>
      <FileText className={icon} />
    </div>
  );
};

export default VideoConsultation;
