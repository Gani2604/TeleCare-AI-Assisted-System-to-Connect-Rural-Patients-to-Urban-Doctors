
import { doctorsList } from "../data/doctors";

interface SelectedDoctorInfoProps {
  doctorId: string | null;
}

const SelectedDoctorInfo = ({ doctorId }: SelectedDoctorInfoProps) => {
  const selectedDoctor = doctorId ? doctorsList.find(doc => doc.id === doctorId) : null;
  
  if (!selectedDoctor) return null;
  
  return (
    <div className="bg-gray-50 p-4 rounded-md flex items-center space-x-4">
      <img
        src={selectedDoctor.image}
        alt={selectedDoctor.name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h3 className="font-medium">{selectedDoctor.name}</h3>
        <p className="text-gray-500">{selectedDoctor.specialty}</p>
      </div>
    </div>
  );
};

export default SelectedDoctorInfo;
