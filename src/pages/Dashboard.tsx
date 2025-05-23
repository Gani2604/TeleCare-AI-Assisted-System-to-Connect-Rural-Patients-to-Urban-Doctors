import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { Calendar, Video, FileText, Clock, User, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DoctorDashboard from "./DoctorDashboard";
import { useEffect } from "react";

const DashboardPage = () => {
  const { t } = useTranslation();
  const { userData } = useAuth();
  
  useEffect(() => {
    console.log("Current user role in dashboard:", userData?.role);
  }, [userData]);

  if (userData?.role === "doctor") {
    console.log("Rendering doctor dashboard");
    return <DoctorDashboard />;
  }

  console.log("Rendering patient dashboard");
  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("dashboard.welcome", { name: userData?.name || "" })}
          </h1>
          <p className="mt-2 text-gray-600">
            Book appointments, view prescriptions, and manage your health records
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">{t("dashboard.quickActions")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-telecare-100 rounded-lg flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-telecare-600" />
                </div>
                <CardTitle>{t("appointments.book")}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/appointments/book">Book Now</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mb-2">
                  <Video className="h-5 w-5 text-accent-400" />
                </div>
                <CardTitle>Start Consultation</CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/consultations">Join Call</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-highlight-100 rounded-lg flex items-center justify-center mb-2">
                  <FileText className="h-5 w-5 text-highlight-400" />
                </div>
                <CardTitle>View Documents</CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/documents">View Files</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                </div>
                <CardTitle>Medical Assistant</CardTitle>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/medical-chat">Ask AI</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">{t("dashboard.upcomingAppointments")}</h2>
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Dr. Sarah Smith
                      </h3>
                      <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Tomorrow, 10:00 AM
                        </span>
                        <span className="flex items-center">
                          <Video className="h-4 w-4 mr-1" />
                          Video Consultation
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button asChild>
                    <Link to="/consultations">Join</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="text-center py-8 border border-dashed rounded-md border-gray-200">
              <p className="text-gray-500">Book more appointments to see them here</p>
              <Button variant="outline" asChild className="mt-2">
                <Link to="/appointments/book">Book Appointment</Link>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Your recent actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-telecare-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-telecare-600" />
                  </div>
                  <div>
                    <p className="font-medium">Appointment Booked</p>
                    <p className="text-sm text-gray-500">You booked an appointment with Dr. Sarah Smith</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-accent-400" />
                  </div>
                  <div>
                    <p className="font-medium">Prescription Uploaded</p>
                    <p className="text-sm text-gray-500">Dr. Sarah Smith uploaded a new prescription</p>
                    <p className="text-xs text-gray-400">Yesterday</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-highlight-100 rounded-full flex items-center justify-center">
                    <Video className="h-4 w-4 text-highlight-400" />
                  </div>
                  <div>
                    <p className="font-medium">Consultation Completed</p>
                    <p className="text-sm text-gray-500">Video consultation with Dr. Sarah Smith</p>
                    <p className="text-xs text-gray-400">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link to="/features">Learn More About TeleCare Features</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
