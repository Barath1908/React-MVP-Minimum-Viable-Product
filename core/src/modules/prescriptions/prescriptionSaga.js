import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";

import prescriptionAPI from "./prescriptionAPI";

import {
  fetchPrescriptionsRequest,
  fetchPrescriptionsSuccess,
  fetchPrescriptionsFailure,

  createPrescriptionRequest,
  createPrescriptionSuccess,
  createPrescriptionFailure,

  updatePrescriptionRequest,
  updatePrescriptionSuccess,
  updatePrescriptionFailure,

  deletePrescriptionRequest,
  deletePrescriptionSuccess,
  deletePrescriptionFailure,
} from "./prescriptionSlice";

function* fetchPrescriptionsSaga() {
  try {
    const response = yield call(
      prescriptionAPI.getPrescriptions
    );

    yield put(
      fetchPrescriptionsSuccess(
        response.data
      )
    );
  } catch (error) {
    yield put(
      fetchPrescriptionsFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

function* createPrescriptionSaga(action) {
  try {
    yield call(
      prescriptionAPI.createPrescription,
      action.payload
    );

    yield put(
      createPrescriptionSuccess()
    );

    yield put(
      fetchPrescriptionsRequest()
    );
  } catch (error) {
    yield put(
      createPrescriptionFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

function* updatePrescriptionSaga(action) {
  try {
    const { id, data } =
      action.payload;

    yield call(
      prescriptionAPI.updatePrescription,
      id,
      data
    );

    yield put(
      updatePrescriptionSuccess()
    );

    yield put(
      fetchPrescriptionsRequest()
    );
  } catch (error) {
    yield put(
      updatePrescriptionFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

function* deletePrescriptionSaga(action) {
  try {
    yield call(
      prescriptionAPI.deletePrescription,
      action.payload
    );

    yield put(
      deletePrescriptionSuccess()
    );

    yield put(
      fetchPrescriptionsRequest()
    );
  } catch (error) {
    yield put(
      deletePrescriptionFailure(
        error.response?.data?.message ||
          error.message
      )
    );
  }
}

export default function* prescriptionSaga() {
  yield takeLatest(
    fetchPrescriptionsRequest.type,
    fetchPrescriptionsSaga
  );

  yield takeLatest(
    createPrescriptionRequest.type,
    createPrescriptionSaga
  );

  yield takeLatest(
    updatePrescriptionRequest.type,
    updatePrescriptionSaga
  );

  yield takeLatest(
    deletePrescriptionRequest.type,
    deletePrescriptionSaga
  );
}