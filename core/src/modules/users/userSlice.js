import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    // FETCH 

    fetchUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },

    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CREATE 

    createUserRequest: (state) => {
      state.loading = true;
    },

    createUserSuccess: (state) => {
      state.loading = false;
    },

    createUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // UPDATE 

    updateUserRequest: (state) => {
      state.loading = true;
    },

    updateUserSuccess: (state) => {
      state.loading = false;
    },

    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // DELETE 

    deleteUserRequest: (state) => {
      state.loading = true;
    },

    deleteUserSuccess: (state) => {
      state.loading = false;
    },

    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,

  createUserRequest,
  createUserSuccess,
  createUserFailure,

  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,

  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;

export default userSlice.reducer;