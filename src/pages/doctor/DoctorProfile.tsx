
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, MapPin, Star, ThumbsUp, User, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

// Import dummy doctor data and time slots
import { doctorsList } from "../Doctors";
import { timeSlots } from "../appointments/data/doctors";

interface DoctorReview {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const { t } = useTranslation();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  // Dummy reviews data
  const reviews: DoctorReview[] = [
    {
      id: "r1",
      patientName: "Amit Sharma",
      rating: 5,
      comment: "Dr. Sharma was very professional and took the time to explain everything thoroughly. Highly recommended!",
      date: "2025-03-15"
    },
    {
      id: "r2",
      patientName: "Priya Patel",
      rating: 4,
      comment: "Good experience overall. Doctor was knowledgeable and provided helpful advice.",
      date: "2025-02-28"
    },
    {
      id: "r3",
      patientName: "Rahul Gupta",
      rating: 5,
      comment: "Excellent doctor! Very patient and explained my condition clearly.",
      date: "2025-02-10"
    }
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use the dummy data
        console.log("Fetching doctor with ID:", doctorId);
        const foundDoctor = doctorsList.find(doc => doc.id === Number(doctorId));
        
        if (foundDoctor) {
          console.log("Doctor found:", foundDoctor);
          setDoctor(foundDoctor);
        } else {
          console.error("Doctor not found with ID:", doctorId);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telecare-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Doctor Not Found</h2>
            <p className="text-gray-500 mb-6">The doctor profile you're looking for doesn't exist or may have been removed.</p>
            <Button asChild>
              <Link to="/doctors">Browse All Doctors</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-gray-100 shadow-md"
              />
              <div className="flex items-center mt-4 space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= doctor.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">{doctor.rating} ({doctor.reviews} reviews)</span>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{doctor.name}</h1>
              <p className="text-telecare-600 font-medium mb-4">{doctor.specialty}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <ThumbsUp className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{t("doctors.yearsExp", { years: doctor.experience })}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Next available: {doctor.nextAvailable}</span>
                </div>
                <div className="flex items-center font-medium">
                  <span>Consultation Fee: ₹{doctor.fee}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button asChild className="flex-1">
                  <Link to="/appointments/book">Book Appointment</Link>
                </Button>
                <Button variant="outline" className="flex-1">
                  <Link to={`/consultation-room/${doctor.id}`}>Video Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="reviews">Patient Reviews</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About {doctor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Dr. {doctor.name.split(' ')[1]} is a highly experienced {doctor.specialty.toLowerCase()} with over {doctor.experience} years of clinical practice. 
                  Specializing in the diagnosis and treatment of various conditions, Dr. {doctor.name.split(' ')[1]} is committed to providing 
                  personalized care to all patients.
                </p>
                <p>
                  After completing medical training at AIIMS, Dr. {doctor.name.split(' ')[1]} pursued further specialization at 
                  prestigious institutions before establishing a successful practice in {doctor.location.split(',')[0]}.
                </p>
                
                <h3 className="text-lg font-semibold mt-4">Specializations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>General {doctor.specialty} consultation</li>
                  <li>Advanced diagnostic procedures</li>
                  <li>Preventive care and health management</li>
                  <li>Specialized treatments in {doctor.specialty.toLowerCase()}</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4">Education & Training</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>MBBS, All India Institute of Medical Sciences (AIIMS)</li>
                  <li>MD in {doctor.specialty}, AIIMS</li>
                  <li>Fellowship in Advanced {doctor.specialty}, UK</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Patient Reviews</CardTitle>
              <CardDescription>Reviews from patients who consulted with Dr. {doctor.name.split(' ')[1]}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{review.patientName}</h4>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">View All Reviews</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Schedule</CardTitle>
              <CardDescription>Available times for appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Clinic Hours</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between"><span>Monday - Friday</span><span>9:00 AM - 5:00 PM</span></li>
                    <li className="flex justify-between"><span>Saturday</span><span>9:00 AM - 1:00 PM</span></li>
                    <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Video Consultation Hours</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between"><span>Monday - Friday</span><span>6:00 PM - 8:00 PM</span></li>
                    <li className="flex justify-between"><span>Saturday</span><span>2:00 PM - 5:00 PM</span></li>
                    <li className="flex justify-between"><span>Sunday</span><span>10:00 AM - 12:00 PM</span></li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Next Available Slots</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {timeSlots.slice(0, 8).map((slot, index) => (
                    <div key={index} className="border rounded p-2 text-center text-sm hover:bg-gray-50 cursor-pointer transition">
                      <div className="font-medium">{slot}</div>
                      <div className="text-xs text-gray-500">Tomorrow</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/appointments/book">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorProfile;
