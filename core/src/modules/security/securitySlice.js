import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  csrfToken: null,
  sessionExpired: false,
  tokenValid: true,
  loading: false,
  error: null,
};

const securitySlice = createSlice({
  name: "security",
  initialState,

  reducers: {
    setCsrfToken: (state, action) => {
      state.csrfToken = action.payload;
    },

    clearCsrfToken: (state) => {
      state.csrfToken = null;
    },

    setSessionExpired: (state, action) => {
      state.sessionExpired = action.payload;
    },

    setTokenValid: (state, action) => {
      state.tokenValid = action.payload;
    },

    securityRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    securitySuccess: (state) => {
      state.loading = false;
    },

    securityFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearSecurityError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCsrfToken,
  clearCsrfToken,
  setSessionExpired,
  setTokenValid,
  securityRequest,
  securitySuccess,
  securityFailure,
  clearSecurityError,
} = securitySlice.actions;

export default securitySlice.reducer;