
import { useTranslation } from "react-i18next";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { timeSlots } from "../data/doctors";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentSchema";

interface TimeSelectionProps {
  form: UseFormReturn<AppointmentFormValues>;
}

const TimeSelection = ({ form }: TimeSelectionProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("appointments.selectTime")}</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TimeSelection;
