
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

// Form schema for patient data
const patientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(1, { message: "Age must be at least 1." }).max(120, { message: "Age cannot exceed 120." }),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Please select a gender." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }).optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"], { required_error: "Please select a blood group." }),
  weight: z.coerce.number().min(1, { message: "Weight must be at least 1 kg." }).max(250, { message: "Weight cannot exceed 250 kg." }).optional(),
  height: z.coerce.number().min(30, { message: "Height must be at least 30 cm." }).max(250, { message: "Height cannot exceed 250 cm." }).optional(),
  condition: z.string().min(2, { message: "Condition must be at least 2 characters." }),
  allergies: z.string().optional().or(z.literal("")),
  medications: z.string().optional().or(z.literal("")),
  medicalNotes: z.string().optional().or(z.literal("")),
  isEmergencyContact: z.boolean().default(false),
  emergencyContactName: z.string().optional().or(z.literal("")),
  emergencyContactPhone: z.string().optional().or(z.literal("")),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

// Mock patient data
const mockPatients = {
  "p1": {
    id: "p1",
    name: "Rahul Sharma",
    age: 42,
    gender: "Male",
    email: "rahul.sharma@example.com",
    phone: "9876543210",
    address: "123 Main St, Mumbai, Maharashtra",
    bloodGroup: "A+",
    weight: 72,
    height: 175,
    condition: "Hypertension",
    allergies: "Penicillin",
    medications: "Amlodipine 5mg daily",
    medicalNotes: "Patient has well-controlled hypertension. Regular monitoring advised.",
    isEmergencyContact: true,
    emergencyContactName: "Neha Sharma",
    emergencyContactPhone: "9876543211"
  },
  "p2": {
    id: "p2",
    name: "Priya Patel",
    age: 35,
    gender: "Female",
    email: "priya.patel@example.com",
    phone: "8765432109",
    address: "456 Park Ave, Delhi, NCR",
    bloodGroup: "B+",
    weight: 65,
    height: 162,
    condition: "Migraine",
    allergies: "None",
    medications: "Sumatriptan as needed",
    medicalNotes: "Patient experiences migraine attacks approximately twice a month.",
    isEmergencyContact: true,
    emergencyContactName: "Raj Patel",
    emergencyContactPhone: "8765432108"
  },
  "p3": {
    id: "p3",
    name: "Ananya Desai",
    age: 58,
    gender: "Female",
    email: "ananya.desai@example.com",
    phone: "7654321098",
    address: "789 Garden Rd, Bangalore, Karnataka",
    bloodGroup: "O+",
    weight: 70,
    height: 158,
    condition: "Type 2 Diabetes",
    allergies: "Sulfa drugs",
    medications: "Metformin 500mg twice daily",
    medicalNotes: "Patient has shown improvement in HbA1c levels. Continue current management.",
    isEmergencyContact: false,
    emergencyContactName: "",
    emergencyContactPhone: ""
  }
};

const PatientEdit = () => {
  const { t } = useTranslation();
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Create form with validation
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "Male" as const,
      email: "",
      phone: "",
      address: "",
      bloodGroup: "Unknown" as const,
      weight: undefined,
      height: undefined,
      condition: "",
      allergies: "",
      medications: "",
      medicalNotes: "",
      isEmergencyContact: false,
      emergencyContactName: "",
      emergencyContactPhone: "",
    }
  });

  // Load patient data
  useEffect(() => {
    const loadPatientData = async () => {
      if (!patientId) return;

      setIsLoading(true);
      try {
        // In a real app, you would fetch this from an API
        // For now, we'll use mock data
        const patientData = mockPatients[patientId as keyof typeof mockPatients];
        
        if (patientData) {
          // Reset form with patient data
          form.reset({
            name: patientData.name,
            age: patientData.age,
            gender: patientData.gender as any,
            email: patientData.email || "",
            phone: patientData.phone || "",
            address: patientData.address || "",
            bloodGroup: patientData.bloodGroup as any,
            weight: patientData.weight,
            height: patientData.height,
            condition: patientData.condition,
            allergies: patientData.allergies || "",
            medications: patientData.medications || "",
            medicalNotes: patientData.medicalNotes || "",
            isEmergencyContact: patientData.isEmergencyContact,
            emergencyContactName: patientData.emergencyContactName || "",
            emergencyContactPhone: patientData.emergencyContactPhone || "",
          });
        } else {
          toast.error("Patient not found");
          navigate("/patients");
        }
      } catch (error) {
        console.error("Error loading patient data:", error);
        toast.error("Failed to load patient data");
      } finally {
        setIsLoading(false);
      }
    };

    loadPatientData();
  }, [patientId, form, navigate]);

  const onSubmit = async (values: PatientFormValues) => {
    setIsSaving(true);
    try {
      // In a real app, you would send this to an API
      console.log("Updating patient data:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Patient information updated successfully");
      navigate(`/patients/${patientId}`);
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Failed to update patient information");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Edit Patient Details</h1>
          <Button variant="outline" onClick={() => navigate(`/patients/${patientId}`)}>
            Cancel
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-telecare-500"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update the patient's basic information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>Update the patient's health details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Group</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                              <SelectItem value="Unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Condition</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any allergies or put 'None' if none"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Medications</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any current medications or put 'None' if none"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional medical notes"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>Update emergency contact information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isEmergencyContact"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Emergency Contact Information</FormLabel>
                          <FormDescription>
                            Toggle on to add emergency contact information
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("isEmergencyContact") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default PatientEdit;
