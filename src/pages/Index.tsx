import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Video, FileText, Search, Clock, Shield } from "lucide-react";
import FloatingChatButton from "@/components/chat/FloatingChatButton";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-telecare-50 to-white py-16 md:py-24">
        <div className="telecare-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {t("home.heroTitle")}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-lg">
                {t("home.heroSubtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/signup">{t("home.getStarted")}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">{t("home.learnMore")}</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="Doctor with tablet"
                className="w-full h-auto rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="telecare-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t("home.servicesTitle")}
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with top doctors through video consultations, manage appointments, and access your medical records anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-telecare-100 rounded-lg flex items-center justify-center mb-5">
                <Video className="h-6 w-6 text-telecare-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Consultations</h3>
              <p className="text-gray-600">
                Connect with doctors through secure video calls from the comfort of your home.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-5">
                <Calendar className="h-6 w-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Appointment Booking</h3>
              <p className="text-gray-600">
                Book appointments with just a few clicks and receive instant confirmations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-highlight-100 rounded-lg flex items-center justify-center mb-5">
                <FileText className="h-6 w-6 text-highlight-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Prescriptions</h3>
              <p className="text-gray-600">
                Access your prescriptions digitally and share them with pharmacies easily.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-telecare-100 rounded-lg flex items-center justify-center mb-5">
                <Search className="h-6 w-6 text-telecare-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Specialists</h3>
              <p className="text-gray-600">
                Search for specialists based on symptoms, specialty, or location.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-5">
                <Clock className="h-6 w-6 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Availability</h3>
              <p className="text-gray-600">
                Get medical assistance any time of day or night with our on-call doctors.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-highlight-100 rounded-lg flex items-center justify-center mb-5">
                <Shield className="h-6 w-6 text-highlight-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Medical Records</h3>
              <p className="text-gray-600">
                Your medical data is encrypted and securely stored in compliance with regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-telecare-500">
        <div className="telecare-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to experience healthcare made simple?
          </h2>
          <Button size="lg" variant="secondary" asChild className="bg-white text-telecare-600 hover:bg-gray-100">
            <Link to="/signup">Get Started Today</Link>
          </Button>
        </div>
      </section>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  );
};

export default Index;
