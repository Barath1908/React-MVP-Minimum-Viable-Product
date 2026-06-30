import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prescriptions: [],
  loading: false,
  error: null,
};

const prescriptionSlice = createSlice({
  name: "prescriptions",

  initialState,

  reducers: {
    fetchPrescriptionsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchPrescriptionsSuccess: (
      state,
      action
    ) => {
      state.loading = false;
      state.prescriptions =
        action.payload;
    },

    fetchPrescriptionsFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },

    createPrescriptionRequest: (
      state
    ) => {
      state.loading = true;
    },

    createPrescriptionSuccess: (
      state
    ) => {
      state.loading = false;
    },

    createPrescriptionFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },

    updatePrescriptionRequest: (
      state
    ) => {
      state.loading = true;
    },

    updatePrescriptionSuccess: (
      state
    ) => {
      state.loading = false;
    },

    updatePrescriptionFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },

    deletePrescriptionRequest: (
      state
    ) => {
      state.loading = true;
    },

    deletePrescriptionSuccess: (
      state
    ) => {
      state.loading = false;
    },

    deletePrescriptionFailure: (
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
  fetchPrescriptionsRequest,
  fetchPrescriptionsSuccess,
  fetchPrescriptionsFailure,

  createPrescriptionRequest,
  createPrescriptionSuccess,
  createPrescriptionFailure,

  updatePrescriptionRequest,
  updatePrescriptionSuccess,
  updatePrescriptionFailure,

  deletePrescriptionRequest,
  deletePrescriptionSuccess,
  deletePrescriptionFailure,
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;