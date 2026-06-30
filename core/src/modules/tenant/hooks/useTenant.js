import { useDispatch, useSelector } from "react-redux";

import {
  setTenant,
  clearTenant,
} from "../tenantSlice";

const useTenant = () => {
  const dispatch = useDispatch();

  const tenant = useSelector(
    (state) => state.tenant?.tenant
  );

  const loading = useSelector(
    (state) => state.tenant?.loading
  );

  const error = useSelector(
    (state) => state.tenant?.error
  );

  const updateTenant = (tenantData) => {
    dispatch(setTenant(tenantData));
  };

  const resetTenant = () => {
    dispatch(clearTenant());
  };

  return {
    tenant,
    loading,
    error,
    updateTenant,
    resetTenant,
  };
};

export default useTenant;