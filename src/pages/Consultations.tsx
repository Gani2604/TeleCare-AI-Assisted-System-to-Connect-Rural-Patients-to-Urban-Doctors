
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Video, Calendar, Clock, Download, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

interface Consultation {
  id: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  notes?: string;
  prescription?: string;
}

const ConsultationsPage = () => {
  const { consultationId } = useParams();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { userData } = useAuth();

  // Mock consultations data
  const consultations: Consultation[] = [
    {
      id: "1",
      doctorName: "Dr. Priya Sharma",
      specialization: "Cardiology",
      date: "2023-04-15",
      time: "10:00 AM",
      status: "upcoming",
    },
    {
      id: "2",
      doctorName: "Dr. Rajesh Patel",
      specialization: "Dermatology",
      date: "2023-04-10",
      time: "2:30 PM",
      status: "completed",
      notes: "Patient reported skin irritation for 2 weeks. Prescribed antihistamines and topical cream.",
      prescription: "prescription-123.pdf",
    },
    {
      id: "3",
      doctorName: "Dr. Anjali Gupta",
      specialization: "Neurology",
      date: "2023-03-28",
      time: "11:15 AM",
      status: "completed",
      notes: "Follow-up for headaches. Symptoms improving with current medication.",
      prescription: "prescription-456.pdf",
    },
    {
      id: "4",
      doctorName: "Dr. Vikram Singh",
      specialization: "Orthopedics",
      date: "2023-04-20",
      time: "3:00 PM",
      status: "upcoming",
    },
    {
      id: "5",
      doctorName: "Dr. Neha Reddy",
      specialization: "Endocrinology",
      date: "2023-04-05",
      time: "9:30 AM",
      status: "cancelled",
    },
  ];

  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find the consultation if an ID is provided
  const selectedConsultation = consultationId
    ? consultations.find((c) => c.id === consultationId)
    : null;
    
  const handleJoinConsultation = (consultationId: string) => {
    navigate(`/consultation-room/${consultationId}`);
    console.log(`Joining consultation as ${userData?.role}`);
  };

  return (
    <div className="telecare-container py-8">
      <h1 className="text-3xl font-bold mb-6">{t("consultations.title")}</h1>

      {selectedConsultation ? (
        <ConsultationDetail 
          consultation={selectedConsultation}
          onJoin={handleJoinConsultation}
          onBack={() => navigate("/consultations")}
        />
      ) : (
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={t("consultations.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("consultations.all")}</CardTitle>
              <CardDescription>
                {t("consultations.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredConsultations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("consultations.doctor")}</TableHead>
                      <TableHead>{t("consultations.specialization")}</TableHead>
                      <TableHead>{t("consultations.date")}</TableHead>
                      <TableHead>{t("consultations.time")}</TableHead>
                      <TableHead>{t("consultations.status")}</TableHead>
                      <TableHead>{t("general.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsultations.map((consultation) => (
                      <TableRow key={consultation.id}>
                        <TableCell className="font-medium">
                          {consultation.doctorName}
                        </TableCell>
                        <TableCell>{consultation.specialization}</TableCell>
                        <TableCell>{consultation.date}</TableCell>
                        <TableCell>{consultation.time}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              consultation.status === "upcoming"
                                ? "bg-blue-100 text-blue-800"
                                : consultation.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {t(`consultations.status.${consultation.status}`)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {consultation.status === "upcoming" ? (
                            <Button size="sm" variant="outline" className="flex gap-1 items-center" onClick={() => handleJoinConsultation(consultation.id)}>
                              <Video className="h-4 w-4" />
                              {t("consultations.join")}
                            </Button>
                          ) : consultation.status === "completed" ? (
                            <Button size="sm" variant="ghost" className="flex gap-1 items-center">
                              <Download className="h-4 w-4" />
                              {t("consultations.viewSummary")}
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p>{t("consultations.noConsultations")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

interface ConsultationDetailProps {
  consultation: Consultation;
  onJoin: (consultationId: string) => void;
  onBack: () => void;
}

const ConsultationDetail = ({ consultation, onJoin, onBack }: ConsultationDetailProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Button variant="outline" className="mb-4" onClick={onBack}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        {t("general.back")}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{consultation.doctorName}</CardTitle>
          <CardDescription>{consultation.specialization}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span>{consultation.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>{consultation.time}</span>
            </div>
            <div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  consultation.status === "upcoming"
                    ? "bg-blue-100 text-blue-800"
                    : consultation.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {t(`consultations.status.${consultation.status}`)}
              </span>
            </div>
          </div>

          {consultation.status === "upcoming" && (
            <Button className="w-full sm:w-auto" onClick={() => onJoin(consultation.id)}>
              <Video className="h-5 w-5 mr-2" />
              {t("consultations.joinConsultation")}
            </Button>
          )}

          {consultation.notes && (
            <div>
              <h3 className="font-medium mb-2">{t("consultations.notes")}</h3>
              <p className="text-gray-600">{consultation.notes}</p>
            </div>
          )}

          {consultation.prescription && (
            <div>
              <h3 className="font-medium mb-2">{t("consultations.prescription")}</h3>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                {t("consultations.downloadPrescription")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationsPage;
