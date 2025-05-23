
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Video, FileText, Calendar, MessageSquare, User, 
  Shield, Clock, FileCheck, CloudLightning, Download,
  Filter, Settings, Bell, PieChart, CreditCard, FileImage,
  Share, UserPlus, Lock
} from "lucide-react";

const FeaturesPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: "Video Consultations",
      description: "Connect with doctors or patients through high-quality video calls. Share screens, chat in real-time, and conduct consultations from anywhere.",
      icon: <Video className="h-8 w-8 text-telecare-600" />
    },
    {
      title: "Appointment Management",
      description: "Book, reschedule, or cancel appointments. View upcoming appointments and get reminders.",
      icon: <Calendar className="h-8 w-8 text-accent-400" />
    },
    {
      title: "Electronic Health Records",
      description: "Securely store and access patient health records. Track medical history, medications, and treatment plans.",
      icon: <FileText className="h-8 w-8 text-highlight-400" />
    },
    {
      title: "Prescription Management",
      description: "Create, view, and manage digital prescriptions. Patients can easily access their prescribed medications.",
      icon: <FileCheck className="h-8 w-8 text-green-600" />
    },
    {
      title: "AI-Powered Medical Assistant",
      description: "Get instant responses to common medical questions with our AI chatbot. Analyze symptoms and get preliminary guidance.",
      icon: <CloudLightning className="h-8 w-8 text-purple-600" />
    },
    {
      title: "Secure Messaging",
      description: "Communicate securely with healthcare providers or patients through encrypted messaging.",
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Patient Management",
      description: "For doctors: View patient profiles, medical history, and manage patient care efficiently.",
      icon: <User className="h-8 w-8 text-amber-600" />
    },
    {
      title: "Doctor Discovery",
      description: "For patients: Find and connect with specialists based on specialty, location, and availability.",
      icon: <UserPlus className="h-8 w-8 text-cyan-600" />
    },
    {
      title: "Role-Based Access",
      description: "Different dashboards and features for doctors, patients, and administrators, ensuring appropriate access to information.",
      icon: <Shield className="h-8 w-8 text-red-600" />
    },
    {
      title: "24/7 Availability",
      description: "Access healthcare services and information anytime, day or night, from any device.",
      icon: <Clock className="h-8 w-8 text-gray-600" />
    },
    {
      title: "Document Download",
      description: "Download medical reports, prescriptions, and other health-related documents securely to your device.",
      icon: <Download className="h-8 w-8 text-indigo-600" />
    },
    {
      title: "Advanced Filtering",
      description: "Filter documents, appointments, and prescriptions by type, date, status, and other criteria for easy access.",
      icon: <Filter className="h-8 w-8 text-orange-600" />
    },
    {
      title: "Customizable Notifications",
      description: "Set up personalized notification preferences for appointments, prescriptions, messages, and other important updates.",
      icon: <Bell className="h-8 w-8 text-pink-600" />
    },
    {
      title: "Health Analytics",
      description: "View visual representations of health data, treatment progress, and appointment history.",
      icon: <PieChart className="h-8 w-8 text-teal-600" />
    },
    {
      title: "Secure Payment Integration",
      description: "Make secure online payments for consultations and services with multiple payment options.",
      icon: <CreditCard className="h-8 w-8 text-slate-600" />
    },
    {
      title: "Medical Image Sharing",
      description: "Securely share medical images like X-rays, MRIs, and lab results between patients and healthcare providers.",
      icon: <FileImage className="h-8 w-8 text-emerald-600" />
    },
    {
      title: "Collaboration Tools",
      description: "Enable multiple healthcare providers to collaborate on complex cases with shared notes and medical records.",
      icon: <Share className="h-8 w-8 text-violet-600" />
    },
    {
      title: "Profile Customization",
      description: "Personalize your user profile with medical history, allergies, and preferences for a tailored healthcare experience.",
      icon: <Settings className="h-8 w-8 text-rose-600" />
    },
    {
      title: "Enhanced Security",
      description: "State-of-the-art encryption and security measures to protect sensitive medical information and personal data.",
      icon: <Lock className="h-8 w-8 text-stone-600" />
    }
  ];

  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold">TeleCare Platform Features</h1>
          <p className="mt-2 text-gray-600">
            Explore the comprehensive features of our telehealth platform designed for both healthcare providers and patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">How to Use TeleCare</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">For Patients:</h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Create an account and complete your health profile</li>
                <li>Browse available doctors by specialty</li>
                <li>Book appointments at your convenient time</li>
                <li>Join video consultations at the scheduled time</li>
                <li>Access and download your prescriptions and medical records</li>
                <li>Message your healthcare provider for follow-up questions</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold">For Doctors:</h3>
              <ol className="list-decimal ml-5 space-y-2">
                <li>Create a professional profile with your credentials and specialties</li>
                <li>Set your availability for appointments</li>
                <li>View and manage upcoming consultations</li>
                <li>Access patient records and medical history</li>
                <li>Create and issue digital prescriptions</li>
                <li>Follow up with patients through secure messaging</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
