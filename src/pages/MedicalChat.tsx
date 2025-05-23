
import { useTranslation } from "react-i18next";
import MedicalChatbot from "@/components/chat/MedicalChatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MedicalChatPage = () => {
  const { t } = useTranslation();

  const handleSuggestedTopicClick = (topic: string) => {
    // Create a custom event to communicate with the MedicalChatbot component
    const event = new CustomEvent("suggestedTopicSelected", { detail: topic });
    window.dispatchEvent(event);
  };

  return (
    <div className="telecare-container py-8">
      <h1 className="text-3xl font-bold mb-6">{t("chat.title", "AI Medical Assistant")}</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MedicalChatbot />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("chat.howItWorks", "How It Works")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                <li>{t("chat.askQuestions", "Ask medical questions in natural language")}</li>
                <li>{t("chat.getAnswers", "Get evidence-based information quickly")}</li>
                <li>{t("chat.notDiagnosis", "Remember this is not a substitute for professional medical advice")}</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("chat.suggestedTopics", "Suggested Topics")}</CardTitle>
              <CardDescription>Click on any topic to start a conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li 
                  className="p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSuggestedTopicClick("What are common symptoms of seasonal allergies?")}
                >
                  What are common symptoms of seasonal allergies?
                </li>
                <li 
                  className="p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSuggestedTopicClick("How can I manage my diabetes better?")}
                >
                  How can I manage my diabetes better?
                </li>
                <li 
                  className="p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSuggestedTopicClick("What vaccines are recommended for children?")}
                >
                  What vaccines are recommended for children?
                </li>
                <li 
                  className="p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSuggestedTopicClick("How to prevent heart disease?")}
                >
                  How to prevent heart disease?
                </li>
                <li 
                  className="p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSuggestedTopicClick("What are the symptoms of COVID-19?")}
                >
                  What are the symptoms of COVID-19?
                </li>
                <li 
                  className="p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSuggestedTopicClick("How to manage high blood pressure?")}
                >
                  How to manage high blood pressure?
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicalChatPage;
