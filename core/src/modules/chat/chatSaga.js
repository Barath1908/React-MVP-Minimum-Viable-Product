import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";

import chatAPI from "./chatAPI";

import {
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,

  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,

  deleteMessageRequest,
  deleteMessageSuccess,
  deleteMessageFailure,
} from "./chatSlice";

function* fetchMessagesSaga() {
  try {
    const response = yield call(
      chatAPI.getMessages
    );

    yield put(
      fetchMessagesSuccess(
        response.data
      )
    );
  } catch (error) {
    yield put(
      fetchMessagesFailure(
        error.response?.data
          ?.message ||
          error.message
      )
    );
  }
}

function* sendMessageSaga(
  action
) {
  try {
    yield call(
      chatAPI.sendMessage,
      action.payload
    );

    yield put(
      sendMessageSuccess()
    );

    yield put(
      fetchMessagesRequest()
    );
  } catch (error) {
    yield put(
      sendMessageFailure(
        error.response?.data
          ?.message ||
          error.message
      )
    );
  }
}

function* deleteMessageSaga(
  action
) {
  try {
    yield call(
      chatAPI.deleteMessage,
      action.payload
    );

    yield put(
      deleteMessageSuccess()
    );

    yield put(
      fetchMessagesRequest()
    );
  } catch (error) {
    yield put(
      deleteMessageFailure(
        error.response?.data
          ?.message ||
          error.message
      )
    );
  }
}

export default function* chatSaga() {
  yield takeLatest(
    fetchMessagesRequest.type,
    fetchMessagesSaga
  );

  yield takeLatest(
    sendMessageRequest.type,
    sendMessageSaga
  );

  yield takeLatest(
    deleteMessageRequest.type,
    deleteMessageSaga
  );
}