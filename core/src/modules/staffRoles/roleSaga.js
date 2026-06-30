import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";

import roleAPI from "./roleAPI";

import {
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
} from "./roleSlice";

function* fetchRolesSaga() {
  try {
    const response = yield call(
      roleAPI.getRoles
    );

    yield put(
      fetchRolesSuccess(response.data)
    );
  } catch (error) {
    yield put(
      fetchRolesFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

function* createRoleSaga(action) {
  try {
    yield call(
      roleAPI.createRole,
      action.payload
    );

    yield put(createRoleSuccess());

    yield put(fetchRolesRequest());
  } catch (error) {
    yield put(
      createRoleFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

function* updateRoleSaga(action) {
  try {
    const { id, data } = action.payload;

    yield call(
      roleAPI.updateRole,
      id,
      data
    );

    yield put(updateRoleSuccess());

    yield put(fetchRolesRequest());
  } catch (error) {
    yield put(
      updateRoleFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

function* deleteRoleSaga(action) {
  try {
    yield call(
      roleAPI.deleteRole,
      action.payload
    );

    yield put(deleteRoleSuccess());

    yield put(fetchRolesRequest());
  } catch (error) {
    yield put(
      deleteRoleFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

export default function* roleSaga() {
  yield takeLatest(
    fetchRolesRequest.type,
    fetchRolesSaga
  );

  yield takeLatest(
    createRoleRequest.type,
    createRoleSaga
  );

  yield takeLatest(
    updateRoleRequest.type,
    updateRoleSaga
  );

  yield takeLatest(
    deleteRoleRequest.type,
    deleteRoleSaga
  );
}