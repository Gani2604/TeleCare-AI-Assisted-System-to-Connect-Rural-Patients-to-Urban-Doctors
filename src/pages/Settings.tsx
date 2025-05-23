
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Form schemas
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmNewPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { userData, currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    appointment: true,
    prescription: true,
    marketing: false
  });

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      phone: "",
      bio: "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Handle profile update
  const onProfileSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // Here you would call your API to update the profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success(t("settings.updateSuccess"));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password update
  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      // Here you would call Firebase Auth to update the password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success(t("settings.updateSuccess"));
      passwordForm.reset();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    toast.success(`Language changed to ${value === 'en' ? 'English' : value === 'hi' ? 'Hindi' : 'Telugu'}`);
  };

  const handleProfilePictureEdit = () => {
    setIsUploading(true);
    // Simulate uploading a profile picture
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Profile picture updated successfully");
    }, 2000);
  };

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${newSettings[key] ? 'enabled' : 'disabled'}`);
      return newSettings;
    });
  };

  const saveNotificationSettings = () => {
    setIsSubmitting(true);
    // Simulate saving notification settings
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Notification settings saved successfully");
    }, 1000);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("settings.title")}</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="profile">{t("settings.profile")}</TabsTrigger>
            <TabsTrigger value="notifications">{t("settings.notifications")}</TabsTrigger>
            <TabsTrigger value="password">{t("settings.password")}</TabsTrigger>
          </TabsList>

          {/* Profile Settings Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.profile")}</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentUser?.photoURL || ""} alt={userData?.name || ""} />
                    <AvatarFallback>
                      {getInitials(userData?.name || currentUser?.displayName || "")}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" onClick={handleProfilePictureEdit} disabled={isUploading}>
                    {isUploading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                        Uploading...
                      </div>
                    ) : (
                      t("general.edit")
                    )}
                  </Button>
                </div>

                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.fullName")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.email")}</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormDescription>
                            Email cannot be changed.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
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
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <FormLabel>{t("settings.language")}</FormLabel>
                      <Select value={i18n.language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">{t("settings.languages.en")}</SelectItem>
                          <SelectItem value="hi">{t("settings.languages.hi")}</SelectItem>
                          <SelectItem value="te">{t("settings.languages.te")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        t("general.save")
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.notifications")}</CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.email} 
                    onCheckedChange={() => handleNotificationToggle('email')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.sms} 
                    onCheckedChange={() => handleNotificationToggle('sms')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Appointment Reminders</h3>
                    <p className="text-sm text-gray-500">Get reminders before your appointments</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.appointment} 
                    onCheckedChange={() => handleNotificationToggle('appointment')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Prescription Updates</h3>
                    <p className="text-sm text-gray-500">Be notified when new prescriptions are available</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.prescription} 
                    onCheckedChange={() => handleNotificationToggle('prescription')} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">Marketing Communications</h3>
                    <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketing} 
                    onCheckedChange={() => handleNotificationToggle('marketing')} 
                  />
                </div>
                <Button onClick={saveNotificationSettings} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    t("general.save")
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Settings Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.password")}</CardTitle>
                <CardDescription>Update your password.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("settings.currentPassword")}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("settings.newPassword")}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("settings.confirmNewPassword")}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        t("general.save")
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
