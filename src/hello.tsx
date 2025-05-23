// chatbotService.ts
// Function to get chatbot response from Gemini API
export const fetchGeminiAIResponse = async (symptoms: string) => {
    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ symptoms }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch Gemini AI response");
      }
  
      const data = await response.json();
      console.log("Gemini AI response:", data);
  
      return data.recommendation;
    } catch (error) {
      console.error("Chatbot error:", error.message);
      return "Sorry, I couldn't analyze your symptoms. Please consult a doctor.";
    }
  };
  