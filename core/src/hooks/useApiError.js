import { useState, useCallback } from "react";

const useApiError = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((err) => {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong";

    setError(message);

    return message;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
};

export default useApiError;