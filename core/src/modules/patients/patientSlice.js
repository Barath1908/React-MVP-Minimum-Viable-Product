import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patients: [],
  currentPatient: null,
  loading: false,
  error: null,
  searchTerm: "",
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    fetchPatientsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPatientsSuccess: (state, action) => {
      state.loading = false;
      state.patients = action.payload;
    },
    fetchPatientsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchPatientByIdRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.currentPatient = null;
    },
    fetchPatientByIdSuccess: (state, action) => {
      state.loading = false;
      state.currentPatient = action.payload;
    },
    fetchPatientByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createPatientRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPatientSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.patients.unshift(action.payload);
      }
    },
    createPatientFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updatePatientRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePatientSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) {
        const index = state.patients.findIndex((p) => p && p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.currentPatient && state.currentPatient.id === action.payload.id) {
          state.currentPatient = action.payload;
        }
      }
    },
    updatePatientFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deletePatientRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deletePatientSuccess: (state, action) => {
      state.loading = false;
      state.patients = state.patients.filter((p) => p && p.id !== action.payload);
      if (state.currentPatient && state.currentPatient.id === action.payload) {
        state.currentPatient = null;
      }
    },
    deletePatientFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const {
  fetchPatientsRequest,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  fetchPatientByIdRequest,
  fetchPatientByIdSuccess,
  fetchPatientByIdFailure,
  createPatientRequest,
  createPatientSuccess,
  createPatientFailure,
  updatePatientRequest,
  updatePatientSuccess,
  updatePatientFailure,
  deletePatientRequest,
  deletePatientSuccess,
  deletePatientFailure,
  setSearchTerm,
} = patientSlice.actions;

export default patientSlice.reducer;
