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
    fetchPrescriptionsSuccess: (state, action) => {
      state.loading = false;
      state.prescriptions = action.payload;
    },
    fetchPrescriptionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createPrescriptionRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPrescriptionSuccess: (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.prescriptions.unshift(action.payload);
      }
    },
    createPrescriptionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    verifyPrescriptionRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    verifyPrescriptionSuccess: (state, action) => {
      state.loading = false;
      const index = state.prescriptions.findIndex((p) => p && p.id === action.payload?.id);
      if (index !== -1) {
        state.prescriptions[index].status = "verified";
      }
    },
    verifyPrescriptionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    dispensePrescriptionRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    dispensePrescriptionSuccess: (state, action) => {
      state.loading = false;
      const index = state.prescriptions.findIndex((p) => p && p.id === action.payload?.id);
      if (index !== -1) {
        state.prescriptions[index].status = "dispensed";
      }
    },
    dispensePrescriptionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
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
  verifyPrescriptionRequest,
  verifyPrescriptionSuccess,
  verifyPrescriptionFailure,
  dispensePrescriptionRequest,
  dispensePrescriptionSuccess,
  dispensePrescriptionFailure,
} = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
