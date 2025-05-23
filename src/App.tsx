import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/Features";
import Appointments from "./pages/Appointments";
import AppointmentsUpcoming from "./pages/appointments/AppointmentsUpcoming";
import AppointmentsPast from "./pages/appointments/AppointmentsPast";
import AppointmentsCancelled from "./pages/appointments/AppointmentsCancelled";
import AppointmentDetails from "./pages/appointments/AppointmentDetails";
import BookAppointment from "./pages/appointments/BookAppointment";
import Documents from "./pages/Documents";
import Consultations from "./pages/Consultations";
import ConsultationRoom from "./pages/ConsultationRoom";
import Prescription from "./pages/Prescription";
import PrescriptionCreate from "./pages/PrescriptionCreate";
import MedicalChat from "./pages/MedicalChat";
import PatientsList from "./pages/patients/PatientsList";
import PatientDetails from "./pages/patients/PatientDetails";
import PatientEdit from "./pages/patients/PatientEdit";
import Features from "./pages/Features";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointments";
import DoctorsPage from "./pages/Doctors";
import DoctorProfile from "./pages/doctor/DoctorProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/features" element={<Features />} />

              {/* Protected routes for both doctor and patient */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/consultations" element={<Consultations />} />
                <Route path="/consultation-room/:consultationId" element={<ConsultationRoom />} />
                <Route path="/prescriptions/:prescriptionId" element={<Prescription />} />
                <Route path="/medical-chat" element={<MedicalChat />} />
              </Route>

              {/* Patient-only routes */}
              <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
                <Route path="/appointments" element={<Appointments />}>
                  <Route index element={<AppointmentsUpcoming />} />
                  <Route path="past" element={<AppointmentsPast />} />
                  <Route path="cancelled" element={<AppointmentsCancelled />} />
                  <Route path="book" element={<BookAppointment />} />
                </Route>
                <Route path="/appointments/:id" element={<AppointmentDetails />} />
              </Route>

              {/* Doctor-only routes */}
              <Route element={<ProtectedRoute allowedRoles={["doctor", "admin"]} />}>
                <Route path="/prescription/new" element={<PrescriptionCreate />} />
                <Route path="/patients" element={<PatientsList />} />
                <Route path="/patients/:patientId" element={<PatientDetails />} />
                <Route path="/patients/:patientId/edit" element={<PatientEdit />} />
                <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
              </Route>

              {/* Admin-only routes */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                {/* Add admin-specific routes here */}
              </Route>

              {/* Not found route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
