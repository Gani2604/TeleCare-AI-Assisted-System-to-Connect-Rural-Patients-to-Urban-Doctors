
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, Mic, MicOff, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const MedicalChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI medical assistant. How can I help you today? Please note that I can provide general information but not medical diagnoses.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  // Listen for suggested topic events
  useEffect(() => {
    const handleSuggestedTopic = (event: CustomEvent) => {
      if (event.detail) {
        setInput(event.detail);
      }
    };
    
    window.addEventListener("suggestedTopicSelected", handleSuggestedTopic as EventListener);
    
    return () => {
      window.removeEventListener("suggestedTopicSelected", handleSuggestedTopic as EventListener);
    };
  }, []);
  
  // Medical knowledge base for common questions
  const medicalKnowledge = {
    "headache": {
      response: "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. For persistent or severe headaches, please consult a healthcare professional.",
      suggestedDoctors: ["Dr. Rajesh Patel (Neurology)", "Dr. Priya Sharma (General Medicine)"],
      possibleConditions: ["Tension headache", "Migraine", "Cluster headache"]
    },
    "cold": {
      response: "Common cold symptoms include runny nose, sore throat, cough, and mild fever. Rest, staying hydrated, and over-the-counter medications can help manage symptoms.",
      suggestedDoctors: ["Dr. Anjali Gupta (General Medicine)", "Dr. Vikram Singh (ENT)"],
      possibleConditions: ["Common cold", "Seasonal allergies", "Upper respiratory infection"]
    },
    "fever": {
      response: "Fever is often a sign that your body is fighting an infection. Rest, fluids, and fever-reducing medications can help. If fever is high (above 103°F/39.4°C) or persists, seek medical attention.",
      suggestedDoctors: ["Dr. Sanjay Kumar (Internal Medicine)", "Dr. Priya Sharma (General Medicine)"],
      possibleConditions: ["Viral infection", "Bacterial infection", "COVID-19"]
    },
    "diabetes": {
      response: "Diabetes is a condition where the body either doesn't produce enough insulin or cannot effectively use the insulin it produces. Management typically involves monitoring blood sugar, medication, diet control, and regular exercise.",
      suggestedDoctors: ["Dr. Neha Reddy (Endocrinology)", "Dr. Rohan Mehta (Internal Medicine)"],
      possibleConditions: ["Type 1 Diabetes", "Type 2 Diabetes", "Prediabetes"]
    },
    "blood pressure": {
      response: "High blood pressure (hypertension) often has no symptoms but can lead to serious health problems. It can be managed through lifestyle changes, medication, regular monitoring, and medical supervision.",
      suggestedDoctors: ["Dr. Arjun Malhotra (Cardiology)", "Dr. Sanjay Kumar (Internal Medicine)"],
      possibleConditions: ["Hypertension", "Heart disease", "Kidney disease"]
    },
    "covid": {
      response: "COVID-19 symptoms may include fever, cough, shortness of breath, fatigue, body aches, loss of taste or smell. If you suspect COVID-19, get tested and follow local health guidelines for isolation.",
      suggestedDoctors: ["Dr. Priya Sharma (General Medicine)", "Dr. Vikram Singh (Pulmonology)"],
      possibleConditions: ["COVID-19", "Influenza", "Common cold"]
    },
    "vaccination": {
      response: "Vaccinations are essential for preventing various infectious diseases. They work by training the immune system to recognize and fight specific pathogens.",
      suggestedDoctors: ["Dr. Anjali Gupta (General Medicine)", "Dr. Priya Sharma (Pediatrics)"],
      possibleConditions: []
    },
    "back pain": {
  response: "Back pain can result from poor posture, muscle strain, or underlying medical conditions. Rest, stretching, and over-the-counter pain relief may help. Seek medical attention if pain persists or worsens.",
  suggestedDoctors: ["Dr. Vikram Singh (Orthopedics)", "Dr. Kavita Desai (Physiotherapy)"],
  possibleConditions: ["Muscle strain", "Herniated disc", "Sciatica"]
},
"allergies": {
  response: "Allergies can cause sneezing, itching, rashes, or breathing issues. Avoid known allergens and consider antihistamines. Severe cases require medical consultation.",
  suggestedDoctors: ["Dr. Kavita Desai (Allergy Specialist)", "Dr. Rajesh Patel (Dermatology)"],
  possibleConditions: ["Seasonal allergies", "Food allergy", "Allergic rhinitis"]
},
"anxiety": {
  response: "Anxiety may involve excessive worry, restlessness, or physical symptoms like a rapid heartbeat. Techniques like mindfulness, therapy, or medication may help.",
  suggestedDoctors: ["Dr. Meena Iyer (Psychiatry)", "Dr. Rajeev Khanna (Psychology)"],
  possibleConditions: ["Generalized Anxiety Disorder", "Panic disorder", "Social anxiety"]
},
"menstrual cramps": {
  response: "Menstrual cramps are common and often manageable with rest, hydration, and pain relievers. If severe or irregular, consult a gynecologist.",
  suggestedDoctors: ["Dr. Shalini Rao (Gynecology)", "Dr. Priya Sharma (General Medicine)"],
  possibleConditions: ["Dysmenorrhea", "Endometriosis", "Hormonal imbalance"]
},
"acne": {
  response: "Acne is often caused by clogged pores, bacteria, or hormonal changes. Treatment includes good hygiene, topical creams, and in some cases, antibiotics.",
  suggestedDoctors: ["Dr. Rajesh Patel (Dermatology)", "Dr. Kavita Desai (Skin Specialist)"],
  possibleConditions: ["Hormonal acne", "Cystic acne", "Blackheads/whiteheads"]
},
"constipation": {
  response: "Constipation can result from diet, dehydration, or inactivity. High-fiber foods, fluids, and exercise may help. Chronic constipation may need medical attention.",
  suggestedDoctors: ["Dr. Rohan Mehta (Gastroenterology)", "Dr. Sanjay Kumar (Internal Medicine)"],
  possibleConditions: ["IBS", "Dehydration", "Low fiber intake"]
},
"toothache": {
  response: "Toothaches can be caused by cavities, infection, or gum disease. Rinsing with salt water and painkillers may help short-term. See a dentist for lasting relief.",
  suggestedDoctors: ["Dr. Anil Mehra (Dentistry)", "Dr. Neha Reddy (Oral Surgery)"],
  possibleConditions: ["Tooth decay", "Gum infection", "Dental abscess"]
},
    "joint pain": {
      response: "Joint pain can be caused by inflammation, injury, or disease. It's common in conditions like arthritis. Treatment may include medication, physical therapy, or lifestyle modifications.",
      suggestedDoctors: ["Dr. Vikram Singh (Orthopedics)", "Dr. Kavita Desai (Rheumatology)"],
      possibleConditions: ["Osteoarthritis", "Rheumatoid arthritis", "Gout"]
    },
    "stomach pain": {
      response: "Stomach pain can have many causes from indigestion to more serious conditions. If pain is severe, persistent, or accompanied by other symptoms like fever or vomiting, seek medical attention.",
      suggestedDoctors: ["Dr. Rohan Mehta (Gastroenterology)", "Dr. Sanjay Kumar (Internal Medicine)"],
      possibleConditions: ["Gastritis", "Peptic ulcer", "Irritable Bowel Syndrome"]
    },
    "skin rash": {
      response: "Skin rashes can be caused by allergies, infections, or underlying health conditions. Symptoms may include redness, itching, or bumps on the skin.",
      suggestedDoctors: ["Dr. Rajesh Patel (Dermatology)", "Dr. Kavita Desai (Allergy Specialist)"],
      possibleConditions: ["Eczema", "Contact dermatitis", "Fungal infection"]
    }
  };
  
  const processQuery = (query: string) => {
    // Convert query to lowercase for matching
    const lowerQuery = query.toLowerCase();
    
    // Check for keywords in our knowledge base
    for (const [keyword, data] of Object.entries(medicalKnowledge)) {
      if (lowerQuery.includes(keyword)) {
        let response = data.response;
        
        // Add suggested doctors if available
        if (data.suggestedDoctors && data.suggestedDoctors.length > 0) {
          response += "\n\nConsider consulting specialists like:";
          data.suggestedDoctors.forEach(doctor => {
            response += `\n• ${doctor}`;
          });
          response += "\n\nWould you like to book an appointment?";
        }
        
        // Add possible conditions if available
        if (data.possibleConditions && data.possibleConditions.length > 0) {
          response += "\n\nPossible conditions may include:";
          data.possibleConditions.forEach(condition => {
            response += `\n• ${condition}`;
          });
          response += "\n\nNote: This is not a diagnosis. Please consult a healthcare professional.";
        }
        
        return response;
      }
    }
    
    // Default responses if no match found
    const defaultResponses = [
      "Based on your question, I recommend consulting with a healthcare professional for personalized advice.",
      "That's an interesting medical question. While I can provide general information, a doctor would be able to give you specific guidance for your situation.",
      "Thank you for your question. This might require a more detailed medical assessment. Consider discussing this with your doctor.",
      "I understand your concern. A healthcare provider would be able to evaluate your specific situation and provide appropriate guidance.",
      "That's a good question about your health. For accurate diagnosis and treatment, it's best to consult with a medical professional."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Process the message and generate response
    setTimeout(() => {
      const botResponse = processQuery(userMessage.text);
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }
    
    if (isListening) {
      stopListening();
      return;
    }
    
    try {
      setIsListening(true);
      toast.info("Listening for voice input...");
      
      // @ts-ignore - This is a browser API that TypeScript doesn't know about
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        toast.success("Voice input captured");
      };
      
      recognition.onerror = () => {
        toast.error("Error occurred in speech recognition");
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (error) {
      console.error("Speech recognition error:", error);
      toast.error("Failed to start speech recognition");
      setIsListening(false);
    }
  };
  
  const stopListening = () => {
    setIsListening(false);
  };
  
  // Format message text with line breaks
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };
  
  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b bg-telecare-50 flex items-center">
        <Avatar className="h-8 w-8 mr-2 bg-telecare-500">
          <Bot className="h-4 w-4 text-white" />
        </Avatar>
        <h3 className="font-medium">TeleCare Medical Assistant</h3>
      </div>
      
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-telecare-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-line">{formatMessageText(message.text)}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t flex gap-2">
        <Input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your medical question..."
          className="flex-grow"
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleListening}
          className={isListening ? "bg-red-100" : ""}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MedicalChatbot;
