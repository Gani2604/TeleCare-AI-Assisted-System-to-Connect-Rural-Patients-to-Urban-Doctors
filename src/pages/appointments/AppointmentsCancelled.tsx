
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

// Dummy data for cancelled appointments
const cancelledAppointmentsData = [
  {
    id: 201,
    doctorName: "Dr. Vivek Verma",
    doctorSpecialty: "Neurologist",
    doctorImage: "https://randomuser.me/api/portraits/men/12.jpg",
    date: "2023-06-25",
    time: "2:00 PM",
    type: "video",
    status: "cancelled",
    reason: "Doctor unavailable due to emergency"
  }
];

const AppointmentsCancelled = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {cancelledAppointmentsData.length > 0 ? (
        cancelledAppointmentsData.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="hidden md:block">
                    <img
                      src={appointment.doctorImage}
                      alt={appointment.doctorName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-lg">{appointment.doctorName}</h3>
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 rounded-full flex items-center">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Cancelled
                      </span>
                    </div>
                    <p className="text-gray-500">{appointment.doctorSpecialty}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {appointment.time}
                      </span>
                      <span className="flex items-center">
                        {appointment.type === "video" ? (
                          <>
                            <Video className="mr-1 h-4 w-4" />
                            Video Consultation
                          </>
                        ) : (
                          <>
                            <MapPin className="mr-1 h-4 w-4" />
                            In-Person Visit
                          </>
                        )}
                      </span>
                    </div>
                    {appointment.reason && (
                      <p className="mt-2 text-sm text-red-600">{appointment.reason}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <Button className="w-full md:w-auto" asChild>
                    <Link to="/appointments/book">Reschedule</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg border-gray-200">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No Cancelled Appointments</h3>
          <p className="mt-1 text-gray-500">You don't have any cancelled appointments</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsCancelled;
