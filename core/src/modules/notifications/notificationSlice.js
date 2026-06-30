import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",

  initialState,

  reducers: {
    fetchNotificationsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchNotificationsSuccess: (
      state,
      action
    ) => {
      state.loading = false;
      state.notifications =
        action.payload;
    },

    fetchNotificationsFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },

    createNotificationRequest: (
      state
    ) => {
      state.loading = true;
    },

    createNotificationSuccess: (
      state
    ) => {
      state.loading = false;
    },

    createNotificationFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },

    deleteNotificationRequest: (
      state
    ) => {
      state.loading = true;
    },

    deleteNotificationSuccess: (
      state
    ) => {
      state.loading = false;
    },

    deleteNotificationFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },
  },
});

export const {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,

  createNotificationRequest,
  createNotificationSuccess,
  createNotificationFailure,

  deleteNotificationRequest,
  deleteNotificationSuccess,
  deleteNotificationFailure,
} = notificationSlice.actions;

export default notificationSlice.reducer;