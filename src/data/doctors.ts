
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  education: string;
  languages: string[];
  rating: number;
  reviews: number;
  image: string;
  location: string;
  consultationFee: number;
  availability: {
    days: string[];
    hours: string;
  };
  isIndian?: boolean;
}

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    experience: "15 years",
    education: "MBBS, MD (Cardiology), AIIMS Delhi",
    languages: ["English", "Hindi"],
    rating: 4.8,
    reviews: 245,
    image: "/placeholder.svg",
    location: "New Delhi",
    consultationFee: 1500,
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "10:00 AM - 4:00 PM",
    },
    isIndian: true,
  },
  {
    id: "2",
    name: "Dr. Rajesh Patel",
    specialization: "Dermatologist",
    experience: "12 years",
    education: "MBBS, MD (Dermatology), PGIMER Chandigarh",
    languages: ["English", "Hindi", "Gujarati"],
    rating: 4.7,
    reviews: 189,
    image: "/placeholder.svg",
    location: "Mumbai",
    consultationFee: 1200,
    availability: {
      days: ["Tuesday", "Thursday", "Saturday"],
      hours: "11:00 AM - 6:00 PM",
    },
    isIndian: true,
  },
  {
    id: "3",
    name: "Dr. Jennifer Wilson",
    specialization: "Neurologist",
    experience: "18 years",
    education: "MD, Harvard Medical School",
    languages: ["English"],
    rating: 4.9,
    reviews: 312,
    image: "/placeholder.svg",
    location: "Boston",
    consultationFee: 2500,
    availability: {
      days: ["Monday", "Tuesday", "Thursday"],
      hours: "9:00 AM - 5:00 PM",
    },
  },
  {
    id: "4",
    name: "Dr. Anjali Gupta",
    specialization: "Gynecologist",
    experience: "14 years",
    education: "MBBS, MS (Gynecology), KEM Hospital Mumbai",
    languages: ["English", "Hindi", "Marathi"],
    rating: 4.8,
    reviews: 276,
    image: "/placeholder.svg",
    location: "Pune",
    consultationFee: 1300,
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "9:00 AM - 3:00 PM",
    },
    isIndian: true,
  },
  {
    id: "5",
    name: "Dr. Vikram Malhotra",
    specialization: "Orthopedic Surgeon",
    experience: "20 years",
    education: "MBBS, MS (Orthopedics), AIIMS Delhi",
    languages: ["English", "Hindi", "Punjabi"],
    rating: 4.9,
    reviews: 324,
    image: "/placeholder.svg",
    location: "Delhi NCR",
    consultationFee: 1800,
    availability: {
      days: ["Tuesday", "Thursday", "Saturday"],
      hours: "10:00 AM - 6:00 PM",
    },
    isIndian: true,
  },
  {
    id: "6",
    name: "Dr. Meenakshi Reddy",
    specialization: "Pediatrician",
    experience: "16 years",
    education: "MBBS, MD (Pediatrics), JIPMER Pondicherry",
    languages: ["English", "Hindi", "Tamil", "Telugu"],
    rating: 4.7,
    reviews: 198,
    image: "/placeholder.svg",
    location: "Hyderabad",
    consultationFee: 1100,
    availability: {
      days: ["Monday", "Tuesday", "Thursday", "Friday"],
      hours: "9:30 AM - 5:30 PM",
    },
    isIndian: true,
  },
  {
    id: "7",
    name: "Dr. Arjun Nair",
    specialization: "Psychiatrist",
    experience: "13 years",
    education: "MBBS, MD (Psychiatry), NIMHANS Bangalore",
    languages: ["English", "Hindi", "Malayalam"],
    rating: 4.6,
    reviews: 156,
    image: "/placeholder.svg",
    location: "Bangalore",
    consultationFee: 1700,
    availability: {
      days: ["Tuesday", "Wednesday", "Friday"],
      hours: "1:00 PM - 8:00 PM",
    },
    isIndian: true,
  },
  {
    id: "8",
    name: "Dr. Sanjana Singh",
    specialization: "Endocrinologist",
    experience: "11 years",
    education: "MBBS, DM (Endocrinology), SGPGI Lucknow",
    languages: ["English", "Hindi"],
    rating: 4.5,
    reviews: 132,
    image: "/placeholder.svg",
    location: "Lucknow",
    consultationFee: 1400,
    availability: {
      days: ["Monday", "Thursday", "Saturday"],
      hours: "10:00 AM - 4:00 PM",
    },
    isIndian: true,
  },
  {
    id: "9",
    name: "Dr. Ramesh Iyer",
    specialization: "Gastroenterologist",
    experience: "19 years",
    education: "MBBS, DM (Gastroenterology), CMC Vellore",
    languages: ["English", "Hindi", "Tamil", "Malayalam"],
    rating: 4.9,
    reviews: 278,
    image: "/placeholder.svg",
    location: "Chennai",
    consultationFee: 1600,
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "9:00 AM - 5:00 PM",
    },
    isIndian: true,
  },
  {
    id: "10",
    name: "Dr. Kavita Desai",
    specialization: "Ophthalmologist",
    experience: "12 years",
    education: "MBBS, MS (Ophthalmology), LV Prasad Eye Institute",
    languages: ["English", "Hindi", "Marathi", "Gujarati"],
    rating: 4.7,
    reviews: 183,
    image: "/placeholder.svg",
    location: "Ahmedabad",
    consultationFee: 1200,
    availability: {
      days: ["Tuesday", "Thursday", "Saturday"],
      hours: "10:30 AM - 6:30 PM",
    },
    isIndian: true,
  },
];

export const getPopularDoctors = () => {
  return doctors.filter(doctor => doctor.rating >= 4.7).slice(0, 4);
};

export const getIndianDoctors = () => {
  return doctors.filter(doctor => doctor.isIndian === true);
};
