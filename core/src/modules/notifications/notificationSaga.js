import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";

import notificationAPI from "./notificationAPI";

import {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,

  createNotificationRequest,
  createNotificationSuccess,
  createNotificationFailure,

  deleteNotificationRequest,
  deleteNotificationSuccess,
  deleteNotificationFailure,
} from "./notificationSlice";

function* fetchNotificationsSaga() {
  try {
    const response = yield call(
      notificationAPI.getNotifications
    );

    yield put(
      fetchNotificationsSuccess(
        response.data
      )
    );
  } catch (error) {
    yield put(
      fetchNotificationsFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

function* createNotificationSaga(action) {
  try {
    yield call(
      notificationAPI.createNotification,
      action.payload
    );

    yield put(
      createNotificationSuccess()
    );

    yield put(
      fetchNotificationsRequest()
    );
  } catch (error) {
    yield put(
      createNotificationFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

function* deleteNotificationSaga(action) {
  try {
    yield call(
      notificationAPI.deleteNotification,
      action.payload
    );

    yield put(
      deleteNotificationSuccess()
    );

    yield put(
      fetchNotificationsRequest()
    );
  } catch (error) {
    yield put(
      deleteNotificationFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

export default function* notificationSaga() {
  yield takeLatest(
    fetchNotificationsRequest.type,
    fetchNotificationsSaga
  );

  yield takeLatest(
    createNotificationRequest.type,
    createNotificationSaga
  );

  yield takeLatest(
    deleteNotificationRequest.type,
    deleteNotificationSaga
  );
}