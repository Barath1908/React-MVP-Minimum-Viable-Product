import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../modules/auth/hooks/useAuth";
import { ROUTES } from "../../utils/constants";

const LogoutPage = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, logout, navigate]);

  return <h2>Logging out...</h2>;
};

export default LogoutPage;