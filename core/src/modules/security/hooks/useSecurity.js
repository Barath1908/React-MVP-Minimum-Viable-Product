import { useDispatch, useSelector } from "react-redux";

import {
  setCsrfToken,
  setSessionExpired,
  setTokenValid,
  clearCsrfToken,
} from "../securitySlice";

const useSecurity = () => {
  const dispatch = useDispatch();

  const csrfToken = useSelector(
    (state) => state.security.csrfToken
  );

  const sessionExpired = useSelector(
    (state) => state.security.sessionExpired
  );

  const tokenValid = useSelector(
    (state) => state.security.tokenValid
  );

  const loading = useSelector(
    (state) => state.security.loading
  );

  const error = useSelector(
    (state) => state.security.error
  );

  const updateCsrfToken = (token) => {
    dispatch(setCsrfToken(token));
  };

  const expireSession = () => {
    dispatch(setSessionExpired(true));
  };

  const validateToken = (status) => {
    dispatch(setTokenValid(status));
  };

  const resetCsrfToken = () => {
    dispatch(clearCsrfToken());
  };

  return {
    csrfToken,
    sessionExpired,
    tokenValid,
    loading,
    error,
    updateCsrfToken,
    expireSession,
    validateToken,
    resetCsrfToken,
  };
};

export default useSecurity;