
import { useTranslation } from "react-i18next";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "../schemas/appointmentSchema";

interface ReasonForVisitProps {
  form: UseFormReturn<AppointmentFormValues>;
}

const ReasonForVisit = ({ form }: ReasonForVisitProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("appointments.reasonForVisit")}</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Describe your symptoms or reason for the appointment"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            This information helps the doctor prepare for your consultation.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ReasonForVisit;
