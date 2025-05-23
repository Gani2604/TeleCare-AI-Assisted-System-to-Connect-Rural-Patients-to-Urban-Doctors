
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doctorsList } from "../data/doctors";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentSchema";

interface DoctorSelectionProps {
  form: UseFormReturn<AppointmentFormValues>;
  onDoctorChange: (doctorId: string) => void;
}

const DoctorSelection = ({ form, onDoctorChange }: DoctorSelectionProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="doctor"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel>{t("appointments.selectDoctor")}</FormLabel>
          <FormControl>
            <Select 
              value={field.value} 
              onValueChange={(value) => {
                field.onChange(value);
                onDoctorChange(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctorsList.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DoctorSelection;
