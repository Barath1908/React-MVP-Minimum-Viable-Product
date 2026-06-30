import { createSlice } from "@reduxjs/toolkit";
import tokenService from "../../services/tokenService";

const token = tokenService.getAccessToken();
const user  = tokenService.getUser();

const initialState = {
  user:            user  || null,   // { id, role, email, fullName }
  token:           token || null,
  loading:         false,
  error:           null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },

    loginSuccess: (state, action) => {
      state.loading         = false;
      state.user            = action.payload.user;
      state.token           = action.payload.access_token;
      state.isAuthenticated = true;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },

    logoutRequest: (state) => {
      state.loading = true;
    },

    logoutSuccess: () => ({
      user:            null,
      token:           null,
      loading:         false,
      error:           null,
      isAuthenticated: false,
    }),

    logoutFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;