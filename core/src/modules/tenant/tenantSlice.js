import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tenant: null,       // { company_name, subdomain, theme, plan_type }
  loading: false,
  error: null,
  isLandingPage: false,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant: (state, action) => {
      state.tenant  = action.payload;
      state.loading = false;
      state.error   = null;
    },

    clearTenant: (state) => {
      state.tenant = null;
    },

    setLandingPage: (state, action) => {
      state.isLandingPage = action.payload;
    },

    tenantRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },

    tenantSuccess: (state, action) => {
      state.loading = false;
      state.tenant  = action.payload;
    },

    tenantFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },
  },
});

export const {
  setTenant,
  clearTenant,
  setLandingPage,
  tenantRequest,
  tenantSuccess,
  tenantFailure,
} = tenantSlice.actions;

export default tenantSlice.reducer;