import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roles: [],
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: "roles",

  initialState,

  reducers: {
    fetchRolesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchRolesSuccess: (state, action) => {
      state.loading = false;
      state.roles = action.payload;
    },

    fetchRolesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createRoleRequest: (state) => {
      state.loading = true;
    },

    createRoleSuccess: (state) => {
      state.loading = false;
    },

    createRoleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateRoleRequest: (state) => {
      state.loading = true;
    },

    updateRoleSuccess: (state) => {
      state.loading = false;
    },

    updateRoleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteRoleRequest: (state) => {
      state.loading = true;
    },

    deleteRoleSuccess: (state) => {
      state.loading = false;
    },

    deleteRoleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchRolesRequest,
  fetchRolesSuccess,
  fetchRolesFailure,

  createRoleRequest,
  createRoleSuccess,
  createRoleFailure,

  updateRoleRequest,
  updateRoleSuccess,
  updateRoleFailure,

  deleteRoleRequest,
  deleteRoleSuccess,
  deleteRoleFailure,
} = roleSlice.actions;

export default roleSlice.reducer;