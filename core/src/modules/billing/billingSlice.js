import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
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

    fetchInvoicesSuccess: (
      state,
      action
    ) => {
      state.loading = false;
      state.invoices =
        action.payload;
    },

    fetchInvoicesFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },

    createInvoiceRequest: (
      state
    ) => {
      state.loading = true;
    },

    createInvoiceSuccess: (
      state
    ) => {
      state.loading = false;
    },

    createInvoiceFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },

    updateInvoiceRequest: (
      state
    ) => {
      state.loading = true;
    },

    updateInvoiceSuccess: (
      state
    ) => {
      state.loading = false;
    },

    updateInvoiceFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },

    deleteInvoiceRequest: (
      state
    ) => {
      state.loading = true;
    },

    deleteInvoiceSuccess: (
      state
    ) => {
      state.loading = false;
    },

    deleteInvoiceFailure: (
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
  fetchInvoicesRequest,
  fetchInvoicesSuccess,
  fetchInvoicesFailure,

  createInvoiceRequest,
  createInvoiceSuccess,
  createInvoiceFailure,

  updateInvoiceRequest,
  updateInvoiceSuccess,
  updateInvoiceFailure,

  deleteInvoiceRequest,
  deleteInvoiceSuccess,
  deleteInvoiceFailure,
} = billingSlice.actions;

export default billingSlice.reducer;