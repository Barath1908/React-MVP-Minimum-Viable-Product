import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    fetchAppointmentsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAppointmentsSuccess: (state, action) => {
      state.loading = false;
      state.appointments = action.payload;
    },
    fetchAppointmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchAppointmentByIdRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.currentAppointment = null;
    },
    fetchAppointmentByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentAppointment = action.payload;
    },
    fetchAppointmentByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createAppointmentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createAppointmentSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.appointments.unshift(action.payload);
      }
    },
    createAppointmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateAppointmentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateAppointmentSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) {
        const index = state.appointments.findIndex((a) => a && a.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.currentAppointment && state.currentAppointment.id === action.payload.id) {
          state.currentAppointment = action.payload;
        }
      }
    },
    updateAppointmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteAppointmentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteAppointmentSuccess: (state, action) => {
      state.loading = false;
      state.appointments = state.appointments.filter((a) => a && a.id !== action.payload);
      if (state.currentAppointment && state.currentAppointment.id === action.payload) {
        state.currentAppointment = null;
      }
    },
    deleteAppointmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAppointmentsRequest,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  fetchAppointmentByIdRequest,
  fetchAppointmentByIdSuccess,
  fetchAppointmentByIdFailure,
  createAppointmentRequest,
  createAppointmentSuccess,
  createAppointmentFailure,
  updateAppointmentRequest,
  updateAppointmentSuccess,
  updateAppointmentFailure,
  deleteAppointmentRequest,
  deleteAppointmentSuccess,
  deleteAppointmentFailure,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
