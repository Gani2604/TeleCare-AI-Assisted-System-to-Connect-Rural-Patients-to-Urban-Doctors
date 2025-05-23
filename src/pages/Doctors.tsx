import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Search, MapPin, Star, Clock, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

// Dummy doctor data - exported so it can be used in DoctorProfile.tsx
export const doctorsList = [
  {
    id: 1,
    name: "Dr. Sandeep Sharma",
    specialty: "Cardiologist",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    experience: 12,
    location: "Mumbai, Maharashtra",
    fee: 1000,
    rating: 4.8,
    reviews: 124,
    nextAvailable: "Today, 3:00 PM"
  },
  {
    id: 2,
    name: "Dr. Priya Patel",
    specialty: "Dermatologist",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    experience: 8,
    location: "Delhi, NCR",
    fee: 800,
    rating: 4.7,
    reviews: 98,
    nextAvailable: "Tomorrow, 10:00 AM"
  },
  {
    id: 3,
    name: "Dr. Rajesh Kumar",
    specialty: "Orthopedist",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    experience: 15,
    location: "Bangalore, Karnataka",
    fee: 1200,
    rating: 4.9,
    reviews: 156,
    nextAvailable: "Today, 5:30 PM"
  },
  {
    id: 4,
    name: "Dr. Anjali Singh",
    specialty: "Pediatrician",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    experience: 10,
    location: "Hyderabad, Telangana",
    fee: 900,
    rating: 4.6,
    reviews: 112,
    nextAvailable: "Monday, 11:00 AM"
  },
  {
    id: 5,
    name: "Dr. Vivek Verma",
    specialty: "Neurologist",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    experience: 14,
    location: "Chennai, Tamil Nadu",
    fee: 1500,
    rating: 4.9,
    reviews: 87,
    nextAvailable: "Tomorrow, 2:15 PM"
  },
  {
    id: 6,
    name: "Dr. Meena Reddy",
    specialty: "Gynecologist",
    image: "https://randomuser.me/api/portraits/women/67.jpg",
    experience: 11,
    location: "Pune, Maharashtra",
    fee: 1100,
    rating: 4.8,
    reviews: 143,
    nextAvailable: "Today, 6:30 PM"
  }
];

const specialties = [
  "All Specialties",
  "Cardiologist",
  "Dermatologist",
  "Orthopedist",
  "Pediatrician",
  "Neurologist",
  "Gynecologist",
  "Psychiatrist",
  "Ophthalmologist",
  "ENT Specialist",
  "Dentist"
];

const DoctorsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  
  // Filter doctors based on search and specialty
  const filteredDoctors = doctorsList.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialty === "All Specialties" || doctor.specialty === specialty;
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("doctors.findDoctor")}</h1>
          <p className="mt-2 text-gray-600">
            Find and consult with top specialists from across India
          </p>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input 
                placeholder="Search by doctor name, specialty, or location" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Select Specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Doctors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialty}</p>
                        <div className="flex items-center mt-1 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium mr-1">{doctor.rating}</span>
                          <span className="text-gray-500">({doctor.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        <span>{t("doctors.yearsExp", { years: doctor.experience })}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{doctor.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Next available: {doctor.nextAvailable}</span>
                      </div>
                      <div className="text-sm font-medium">
                        Consultation Fee: ₹{doctor.fee}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-3 flex justify-between">
                  <Button variant="outline" asChild>
                    <Link to={`/doctors/${doctor.id}`}>{t("doctors.viewProfile")}</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/appointments/book">{t("doctors.bookAppointment")}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No doctors found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
