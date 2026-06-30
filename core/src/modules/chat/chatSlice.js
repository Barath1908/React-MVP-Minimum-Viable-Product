import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    fetchMessagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },

    fetchMessagesSuccess: (
      state,
      action
    ) => {
      state.loading = false;
      state.messages =
        action.payload;
    },

    fetchMessagesFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },

    sendMessageRequest: (
      state
    ) => {
      state.loading = true;
    },

    sendMessageSuccess: (
      state
    ) => {
      state.loading = false;
    },

    sendMessageFailure: (
      state,
      action
    ) => {
      state.loading = false;
      state.error =
        action.payload;
    },

    deleteMessageRequest: (
      state
    ) => {
      state.loading = true;
    },

    deleteMessageSuccess: (
      state
    ) => {
      state.loading = false;
    },

    deleteMessageFailure: (
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
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,

  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,

  deleteMessageRequest,
  deleteMessageSuccess,
  deleteMessageFailure,
} = chatSlice.actions;

export default chatSlice.reducer;