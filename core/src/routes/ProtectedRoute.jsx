// ProtectedRoute.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { securityRequest } from "../modules/security/securitySlice";
import useAuth from "../modules/auth/hooks/useAuth";
import { ROUTES } from "../utils/constants";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  const { error: securityError } = useSelector(
    (state) => state.security
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(securityRequest());
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Security check failed — token expired or CSRF missing
  if (securityError) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;