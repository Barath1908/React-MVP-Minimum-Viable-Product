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
    fetchMessagesSuccess: (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    },
    fetchMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    sendMessageRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    sendMessageSuccess: (state, action) => {
      state.loading = false;
      state.messages.push(action.payload);
    },
    sendMessageFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    markMessageReadRequest: (state) => {
      state.error = null;
    },
    markMessageReadSuccess: (state, action) => {
      const index = state.messages.findIndex((m) => m.id === action.payload);
      if (index !== -1) {
        state.messages[index].is_read = 1;
      }
    },
    markMessageReadFailure: (state, action) => {
      state.error = action.payload;
    },

    clearChat: (state) => {
      state.messages = [];
      state.error = null;
      state.loading = false;
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
  markMessageReadRequest,
  markMessageReadSuccess,
  markMessageReadFailure,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
