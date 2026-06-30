import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  loginRequest,
  logoutRequest,
  clearAuthError,
} from "../authSlice";

import {
  selectUser,
  selectLoading,
  selectError,
  selectIsAuthenticated,
  selectUserRole,
} from "../selectors";

const useAuth = () => {
  const dispatch = useDispatch();

  const user            = useSelector(selectUser);
  const loading         = useSelector(selectLoading);
  const error           = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role            = useSelector(selectUserRole);

  const login = useCallback((credentials) => {
    // No tenant_id — each subdomain connects to its own DB
    dispatch(loginRequest(credentials));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutRequest());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    user,
    role,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    clearError,
  };
};

export default useAuth;