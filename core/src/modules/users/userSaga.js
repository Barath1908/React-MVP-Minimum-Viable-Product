import { call, put, takeLatest } from "redux-saga/effects";
import userAPI from "./userAPI";
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  addUserRequest,
  addUserSuccess,
  addUserFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailure,
} from "./userSlice";

function* handleFetchUsers() {
  try {
    const response = yield call(userAPI.fetchUsers);
    const data = response?.payload?.data ?? response?.data ?? [];
    yield put(fetchUsersSuccess(data));
  } catch (error) {
    yield put(
      fetchUsersFailure(
        error.response?.data?.payload?.message || "Failed to fetch staff members"
      )
    );
  }
}

function* handleAddUser(action) {
  try {
    const response = yield call(userAPI.addUser, action.payload);
    const data = response?.payload?.data ?? response?.data;
    yield put(addUserSuccess(data));
  } catch (error) {
    yield put(
      addUserFailure(
        error.response?.data?.payload?.message || "Failed to add staff member"
      )
    );
  }
}

function* handleUpdateUser(action) {
  try {
    const { id, ...data } = action.payload;
    const response = yield call(userAPI.updateUser, id, data);
    const updated = response?.payload?.data ?? response?.data;
    yield put(updateUserSuccess(updated));
  } catch (error) {
    yield put(
      updateUserFailure(
        error.response?.data?.payload?.message || "Failed to update staff member"
      )
    );
  }
}

function* handleDeleteUser(action) {
  try {
    yield call(userAPI.deleteUser, action.payload);
    yield put(deleteUserSuccess(action.payload));
  } catch (error) {
    yield put(
      deleteUserFailure(
        error.response?.data?.payload?.message || "Failed to delete staff member"
      )
    );
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, handleFetchUsers);
  yield takeLatest(addUserRequest.type, handleAddUser);
  yield takeLatest(updateUserRequest.type, handleUpdateUser);
  yield takeLatest(deleteUserRequest.type, handleDeleteUser);
}
