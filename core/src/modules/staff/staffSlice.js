import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staff: [],
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: "staff",

  initialState,

  reducers: {
    fetchStaffRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchStaffSuccess: (state, action) => {
      state.loading = false;
      state.staff = action.payload;
    },

    fetchStaffFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createStaffRequest: (state) => {
      state.loading = true;
    },

    createStaffSuccess: (state) => {
      state.loading = false;
    },

    createStaffFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateStaffRequest: (state) => {
      state.loading = true;
    },

    updateStaffSuccess: (state) => {
      state.loading = false;
    },

    updateStaffFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteStaffRequest: (state) => {
      state.loading = true;
    },

    deleteStaffSuccess: (state) => {
      state.loading = false;
    },

    deleteStaffFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchStaffRequest,
  fetchStaffSuccess,
  fetchStaffFailure,

  createStaffRequest,
  createStaffSuccess,
  createStaffFailure,

  updateStaffRequest,
  updateStaffSuccess,
  updateStaffFailure,

  deleteStaffRequest,
  deleteStaffSuccess,
  deleteStaffFailure,
} = staffSlice.actions;

export default staffSlice.reducer;