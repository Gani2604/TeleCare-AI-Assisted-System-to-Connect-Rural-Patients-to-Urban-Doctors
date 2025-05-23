
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles?: Array<string>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  // Add debugging log
  useEffect(() => {
    if (allowedRoles) {
      console.log("Protected route with allowed roles:", allowedRoles);
      console.log("Current user role:", userData?.role);
      console.log("Current path:", location.pathname);
      console.log("Access granted:", !allowedRoles || !userData?.role || allowedRoles.includes(userData.role));
    }
  }, [allowedRoles, userData, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    console.log("No current user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if doctor is trying to access patient-only routes
  if (userData?.role === "doctor" && location.pathname.startsWith("/doctors")) {
    console.log("Doctor trying to access patient-only route, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // If there are allowed roles and the user has a role, check if they're allowed
  if (allowedRoles && allowedRoles.length > 0 && userData?.role && !allowedRoles.includes(userData.role)) {
    console.log("User role not allowed, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
