
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarPlus } from "lucide-react";

const AppointmentsPage = () => {
  const { t } = useTranslation();
  const { userData } = useAuth();
  const location = useLocation();

  // Determine which tab is active based on the current URL
  let activeTab = "upcoming";
  if (location.pathname.endsWith("/past")) {
    activeTab = "past";
  } else if (location.pathname.endsWith("/cancelled")) {
    activeTab = "cancelled";
  } else if (location.pathname.endsWith("/book")) {
    activeTab = "book";
  }

  return (
    <div className="telecare-container py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{t("appointments.upcoming")}</h1>
          <Button asChild>
            <Link to="/appointments/book">
              <CalendarPlus className="mr-2 h-4 w-4" />
              {t("appointments.book")}
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="upcoming" asChild>
              <Link to="/appointments">{t("appointments.upcoming")}</Link>
            </TabsTrigger>
            <TabsTrigger value="past" asChild>
              <Link to="/appointments/past">{t("appointments.past")}</Link>
            </TabsTrigger>
            <TabsTrigger value="cancelled" asChild>
              <Link to="/appointments/cancelled">{t("appointments.cancelled")}</Link>
            </TabsTrigger>
            <TabsTrigger value="book" asChild className="lg:hidden">
              <Link to="/appointments/book">{t("appointments.book")}</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tab content - handled by outlet */}
        <Outlet />
      </div>
    </div>
  );
};

export default AppointmentsPage;
