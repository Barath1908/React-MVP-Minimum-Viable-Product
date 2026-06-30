import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button onClick={() => navigate(ROUTES.DASHBOARD)}>
        Go to Dashboard
      </button>
    </div>
  );
};

export default UnauthorizedPage;