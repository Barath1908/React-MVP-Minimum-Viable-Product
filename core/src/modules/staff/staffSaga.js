import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";

import staffAPI from "./staffAPI";

import {
  fetchStaffRequest,
  fetchStaffSuccess,
  fetchStaffFailure,

  createStaffRequest,
  createStaffSuccess,
  createStaffFailure,

  updateStaffRequest,
  updateStaffSuccess,
  updateStaffFailure,

  deleteStaffRequest,
  deleteStaffSuccess,
  deleteStaffFailure,
} from "./staffSlice";

function* fetchStaffSaga() {
  try {
    const response = yield call(
      staffAPI.getStaff
    );

    yield put(
      fetchStaffSuccess(response.data.payload.data)
    );
  } catch (error) {
    yield put(
      fetchStaffFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

function* createStaffSaga(action) {

    try {

        yield call(
            staffAPI.createStaff,
            action.payload
        );

        const response = yield call(
            staffAPI.getStaff
        );

        yield put(
            fetchStaffSuccess(
                response.data.payload.data
            )
        );

    } catch (error) {

        yield put(
            createStaffFailure(
                error.response?.data?.message ||
                error.message
            )
        );

    }

}

function* updateStaffSaga(action) {
  try {
    const { id, data } = action.payload;

    yield call(
      staffAPI.updateStaff,
      id,
      data
    );

    yield put(updateStaffSuccess());

    yield put(fetchStaffRequest());
  } catch (error) {
    yield put(
      updateStaffFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

function* deleteStaffSaga(action) {
  try {
    yield call(
      staffAPI.deleteStaff,
      action.payload
    );

    yield put(deleteStaffSuccess());

    yield put(fetchStaffRequest());
  } catch (error) {
    yield put(
      deleteStaffFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

export default function* staffSaga() {
  yield takeLatest(
    fetchStaffRequest.type,
    fetchStaffSaga
  );

  yield takeLatest(
    createStaffRequest.type,
    createStaffSaga
  );

  yield takeLatest(
    updateStaffRequest.type,
    updateStaffSaga
  );

  yield takeLatest(
    deleteStaffRequest.type,
    deleteStaffSaga
  );
}