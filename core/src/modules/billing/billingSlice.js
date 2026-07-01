import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
  summary: null,
  loading: false,
  error: null,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    fetchInvoicesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchInvoicesSuccess: (state, action) => {
      state.loading = false;
      state.invoices = action.payload;
    },
    fetchInvoicesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchSummaryRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSummarySuccess: (state, action) => {
      state.loading = false;
      state.summary = action.payload;
    },
    fetchSummaryFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createInvoiceRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createInvoiceSuccess: (state, action) => {
      state.loading = false;
      state.invoices.unshift(action.payload);
    },
    createInvoiceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateInvoiceRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateInvoiceSuccess: (state, action) => {
      state.loading = false;
      const index = state.invoices.findIndex((inv) => inv.id === action.payload.id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    updateInvoiceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    recordPaymentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    recordPaymentSuccess: (state) => {
      state.loading = false;
      // Payments alter the invoice status, so we trigger a refresh of both lists on success
    },
    recordPaymentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchInvoicesRequest,
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  fetchSummaryRequest,
  fetchSummarySuccess,
  fetchSummaryFailure,
  createInvoiceRequest,
  createInvoiceSuccess,
  createInvoiceFailure,
  updateInvoiceRequest,
  updateInvoiceSuccess,
  updateInvoiceFailure,
  recordPaymentRequest,
  recordPaymentSuccess,
  recordPaymentFailure,
} = billingSlice.actions;

export default billingSlice.reducer;
