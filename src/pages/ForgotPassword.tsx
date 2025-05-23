import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Loader } from "lucide-react";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      // TODO: Implement password reset logic here
      // This is where you would call your backend API to send reset password email
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Password reset link has been sent to your email");
      form.reset();
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <Input className="pl-10" placeholder="name@example.com" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          <Link
            to="/login"
            className="font-medium text-telecare-500 hover:text-telecare-600"
          >
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword; 