
import { useTranslation } from "react-i18next";
import { MapPin, Video } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentSchema";

interface AppointmentTypeSelectionProps {
  form: UseFormReturn<AppointmentFormValues>;
}

const AppointmentTypeSelection = ({ form }: AppointmentTypeSelectionProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{t("appointments.appointmentType")}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="video" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer flex items-center">
                  <Video className="mr-2 h-4 w-4" />
                  {t("appointments.video")}
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="inPerson" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {t("appointments.inPerson")}
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AppointmentTypeSelection;
