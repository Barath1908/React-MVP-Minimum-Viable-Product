import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";

import userAPI from "./userAPI";

import {
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
} from "./userSlice";

// FETCH

function* fetchUsersSaga() {
  try {
    const response = yield call(userAPI.getUsers);

    yield put(fetchUsersSuccess(response.data));
  } catch (error) {
    yield put(
      fetchUsersFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

// CREATE

function* createUserSaga(action) {
  try {
    yield call(
      userAPI.createUser,
      action.payload
    );

    yield put(createUserSuccess());

    yield put(fetchUsersRequest());

  } catch (error) {
    yield put(
      createUserFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

// UPDATE

function* updateUserSaga(action) {
  try {
    const { id, data } = action.payload;

    yield call(
      userAPI.updateUser,
      id,
      data
    );

    yield put(updateUserSuccess());

    yield put(fetchUsersRequest());

  } catch (error) {
    yield put(
      updateUserFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

// DELETE

function* deleteUserSaga(action) {
  try {
    yield call(
      userAPI.deleteUser,
      action.payload
    );

    yield put(deleteUserSuccess());

    yield put(fetchUsersRequest());

  } catch (error) {
    yield put(
      deleteUserFailure(
        error.response?.data?.message || error.message
      )
    );
  }
}

// WATCHERS

export default function* userSaga() {
  yield takeLatest(
    fetchUsersRequest.type,
    fetchUsersSaga
  );

  yield takeLatest(
    createUserRequest.type,
    createUserSaga
  );

  yield takeLatest(
    updateUserRequest.type,
    updateUserSaga
  );

  yield takeLatest(
    deleteUserRequest.type,
    deleteUserSaga
  );
}