import { call, put, takeLatest } from "redux-saga/effects";
import prescriptionAPI from "./prescriptionAPI";
import {
  fetchPrescriptionsRequest,
  fetchPrescriptionsSuccess,
  fetchPrescriptionsFailure,
  createPrescriptionRequest,
  createPrescriptionSuccess,
  createPrescriptionFailure,
  verifyPrescriptionRequest,
  verifyPrescriptionSuccess,
  verifyPrescriptionFailure,
  dispensePrescriptionRequest,
  dispensePrescriptionSuccess,
  dispensePrescriptionFailure,
} from "./prescriptionSlice";

function* handleFetchPrescriptions() {
  try {
    const response = yield call(prescriptionAPI.listPrescriptions);
    const data = response?.payload?.data ?? response?.data ?? [];
    yield put(fetchPrescriptionsSuccess(data));
  } catch (error) {
    yield put(
      fetchPrescriptionsFailure(
        error.response?.data?.payload?.message || "Failed to fetch prescriptions"
      )
    );
  }
}

function* handleCreatePrescription(action) {
  try {
    yield call(prescriptionAPI.createPrescription, action.payload);
    yield put(createPrescriptionSuccess());
    yield put(fetchPrescriptionsRequest());
  } catch (error) {
    yield put(
      createPrescriptionFailure(
        error.response?.data?.payload?.message || "Failed to issue prescription"
      )
    );
  }
}

function* handleVerifyPrescription(action) {
  try {
    yield call(prescriptionAPI.verifyPrescription, action.payload);
    yield put(verifyPrescriptionSuccess({ id: action.payload }));
    yield put(fetchPrescriptionsRequest());
  } catch (error) {
    yield put(
      verifyPrescriptionFailure(
        error.response?.data?.payload?.message || "Failed to verify prescription"
      )
    );
  }
}

function* handleDispensePrescription(action) {
  try {
    yield call(prescriptionAPI.dispensePrescription, action.payload);
    yield put(dispensePrescriptionSuccess({ id: action.payload }));
    yield put(fetchPrescriptionsRequest());
  } catch (error) {
    yield put(
      dispensePrescriptionFailure(
        error.response?.data?.payload?.message || "Failed to dispense medicine"
      )
    );
  }
}

export default function* prescriptionSaga() {
  yield takeLatest(fetchPrescriptionsRequest.type, handleFetchPrescriptions);
  yield takeLatest(createPrescriptionRequest.type, handleCreatePrescription);
  yield takeLatest(verifyPrescriptionRequest.type, handleVerifyPrescription);
  yield takeLatest(dispensePrescriptionRequest.type, handleDispensePrescription);
}
