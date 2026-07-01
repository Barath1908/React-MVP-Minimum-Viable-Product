import useAuth from "./useAuth";
import { hasPermission } from "../../../utils/permissions";

const usePermissions = () => {
  const { role } = useAuth();

  const can = (permission) => {
    return hasPermission(role, permission);
  };

  const PermissionGuard = ({ permission, children, fallback = null }) => {
    if (!can(permission)) {
      return fallback;
    }
    return children;
  };

  return {
    can,
    PermissionGuard,
  };
};

export default usePermissions;
