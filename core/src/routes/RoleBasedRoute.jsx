import { Navigate } from "react-router-dom";
import useAuth from "../modules/auth/hooks/useAuth";
import { ROUTES } from "../utils/constants";

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { role } = useAuth();

  // Normalize to string lowercase for safe comparison
  const normalizedRole = String(role ?? "").toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) => String(r).toLowerCase());

  if (!normalizedAllowed.includes(normalizedRole)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
};

export default RoleBasedRoute;