
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const UnauthorizedPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Unauthorized Access</h1>
        <p className="max-w-md text-gray-600">
          You do not have permission to access this page. Please contact the administrator if you believe this is an error.
        </p>
        <div className="pt-6 space-x-4">
          <Button asChild variant="outline">
            <Link to="/">Go to Home</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
