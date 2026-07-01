import { call, put, takeLatest } from "redux-saga/effects";
import chatAPI from "./chatAPI";
import {
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  sendMessageRequest,
  sendMessageFailure,
  markMessageReadRequest,
  markMessageReadSuccess,
  markMessageReadFailure,
} from "./chatSlice";

function* handleFetchMessages(action) {
  try {
    const response = yield call(chatAPI.getAppointmentMessages, action.payload);
    const data = response?.payload?.data ?? response?.data ?? [];
    yield put(fetchMessagesSuccess(data));
  } catch (error) {
    yield put(
      fetchMessagesFailure(
        error.response?.data?.payload?.message || "Failed to load chat history"
      )
    );
  }
}

function* handleSendMessage(action) {
  try {
    const response = yield call(chatAPI.sendMessage, action.payload);
    const data = response?.payload?.data ?? response?.data;
    if (data?.message_id) {
      // Re-fetch all messages to ensure we get the full details (like correct timestamp, sender details, etc.)
      yield put(fetchMessagesRequest(action.payload.appointment_id));
    }
  } catch (error) {
    yield put(
      sendMessageFailure(
        error.response?.data?.payload?.message || "Failed to send message"
      )
    );
  }
}

function* handleMarkRead(action) {
  try {
    yield call(chatAPI.markRead, action.payload);
    yield put(markMessageReadSuccess(action.payload));
  } catch (error) {
    yield put(
      markMessageReadFailure(
        error.response?.data?.payload?.message || "Failed to update read status"
      )
    );
  }
}

export default function* chatSaga() {
  yield takeLatest(fetchMessagesRequest.type, handleFetchMessages);
  yield takeLatest(sendMessageRequest.type, handleSendMessage);
  yield takeLatest(markMessageReadRequest.type, handleMarkRead);
}
