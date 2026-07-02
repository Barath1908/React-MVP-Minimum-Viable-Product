import { call, put, takeLatest } from "redux-saga/effects";
import patientAPI from "./patientAPI";
import offlineDB from "../../services/offlineDB";
import {
  fetchPatientsRequest,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  fetchPatientByIdRequest,
  fetchPatientByIdSuccess,
  fetchPatientByIdFailure,
  createPatientRequest,
  createPatientSuccess,
  createPatientFailure,
  updatePatientRequest,
  updatePatientSuccess,
  updatePatientFailure,
  deletePatientRequest,
  deletePatientSuccess,
  deletePatientFailure,
} from "./patientSlice";

function* handleFetchPatients() {
  try {
    if (!navigator.onLine) {
      const offlineData = yield call([offlineDB, "getAll"], "patients");
      yield put(fetchPatientsSuccess(offlineData || []));
      return;
    }

    const response = yield call(patientAPI.listPatients);
    const data = response?.payload?.data ?? response?.data ?? [];
    
    yield call([offlineDB, "clear"], "patients");
    for (const patient of data) {
      yield call([offlineDB, "put"], "patients", patient);
    }
    
    yield put(fetchPatientsSuccess(data));
  } catch (error) {
    try {
      const offlineData = yield call([offlineDB, "getAll"], "patients");
      if (offlineData && offlineData.length > 0) {
        yield put(fetchPatientsSuccess(offlineData));
        return;
      }
    } catch (_) {}
    
    yield put(
      fetchPatientsFailure(
        error.response?.data?.payload?.message || "Failed to fetch patients"
      )
    );
  }
}

function* handleFetchPatientById(action) {
  const patientId = action.payload;
  try {
    if (!navigator.onLine) {
      const offlinePatient = yield call([offlineDB, "get"], "patients", patientId);
      if (offlinePatient) {
        yield put(fetchPatientByIdSuccess(offlinePatient));
        return;
      }
      throw new Error("Patient not found offline");
    }

    const response = yield call(patientAPI.getPatientById, patientId);
    const data = response?.payload?.data ?? response?.data ?? null;
    if (data) {
      yield call([offlineDB, "put"], "patients", data);
    }
    yield put(fetchPatientByIdSuccess(data));
  } catch (error) {
    try {
      const offlinePatient = yield call([offlineDB, "get"], "patients", patientId);
      if (offlinePatient) {
        yield put(fetchPatientByIdSuccess(offlinePatient));
        return;
      }
    } catch (_) {}

    yield put(
      fetchPatientByIdFailure(
        error.response?.data?.payload?.message || error.message || "Failed to fetch patient details"
      )
    );
  }
}

function* handleCreatePatient(action) {
  const { data, onSuccess, onFailure } = action.payload || {};
  const payloadData = data || action.payload;

  try {
    if (!navigator.onLine) {
      const tempId = -Date.now();
      const patientRecord = { 
        ...payloadData, 
        id: tempId,
        created_at: new Date().toISOString() 
      };
      
      yield call([offlineDB, "put"], "patients", patientRecord);
      
      const queueItem = {
        operation: "CREATE",
        module: "patients",
        payload: payloadData,
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending",
        tempId: tempId
      };
      yield call([offlineDB, "put"], "offlineQueue", queueItem);
      
      yield put(createPatientSuccess(patientRecord));
      if (onSuccess) yield call(onSuccess, patientRecord);
      return;
    }

    const response = yield call(patientAPI.createPatient, payloadData);
    const patientId = response?.payload?.data?.patient_id;
    
    if (patientId) {
      const fetchResponse = yield call(patientAPI.getPatientById, patientId);
      const newPatient = fetchResponse?.payload?.data ?? fetchResponse?.data;
      
      if (newPatient) {
        yield call([offlineDB, "put"], "patients", newPatient);
        yield put(createPatientSuccess(newPatient));
        if (onSuccess) yield call(onSuccess, newPatient);
      } else {
        yield put(fetchPatientsRequest());
        if (onSuccess) yield call(onSuccess);
      }
    } else {
      yield put(fetchPatientsRequest());
      if (onSuccess) yield call(onSuccess);
    }
  } catch (error) {
    const isNetworkError = !error.response;
    if (isNetworkError) {
      const tempId = -Date.now();
      const patientRecord = { 
        ...payloadData, 
        id: tempId,
        created_at: new Date().toISOString() 
      };
      yield call([offlineDB, "put"], "patients", patientRecord);
      yield call([offlineDB, "put"], "offlineQueue", {
        operation: "CREATE",
        module: "patients",
        payload: payloadData,
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending",
        tempId: tempId
      });
      yield put(createPatientSuccess(patientRecord));
      if (onSuccess) yield call(onSuccess, patientRecord);
    } else {
      const errMsg = error.response?.data?.payload?.message || "Failed to create patient";
      yield put(createPatientFailure(errMsg));
      if (onFailure) yield call(onFailure, errMsg);
    }
  }
}

function* handleUpdatePatient(action) {
  const { id, data, onSuccess, onFailure } = action.payload || {};
  
  // Backwards compatibility with plain payloads
  const patientId = id || action.payload?.id;
  const updateData = data || action.payload?.data || action.payload;

  try {
    if (!navigator.onLine) {
      const existing = yield call([offlineDB, "get"], "patients", patientId);
      const updatedRecord = { ...existing, ...updateData };
      yield call([offlineDB, "put"], "patients", updatedRecord);
      
      yield call([offlineDB, "put"], "offlineQueue", {
        operation: "UPDATE",
        module: "patients",
        payload: { id: patientId, data: updateData },
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending"
      });
      
      yield put(updatePatientSuccess(updatedRecord));
      if (onSuccess) yield call(onSuccess, updatedRecord);
      return;
    }

    yield call(patientAPI.updatePatient, patientId, updateData);
    const fetchResponse = yield call(patientAPI.getPatientById, patientId);
    const updated = fetchResponse?.payload?.data ?? fetchResponse?.data;
    
    if (updated) {
      yield call([offlineDB, "put"], "patients", updated);
      yield put(updatePatientSuccess(updated));
      if (onSuccess) yield call(onSuccess, updated);
    } else {
      const fallbackUpdated = { ...updateData, id: patientId };
      yield call([offlineDB, "put"], "patients", fallbackUpdated);
      yield put(updatePatientSuccess(fallbackUpdated));
      if (onSuccess) yield call(onSuccess, fallbackUpdated);
    }
  } catch (error) {
    const isNetworkError = !error.response;
    if (isNetworkError) {
      const existing = yield call([offlineDB, "get"], "patients", patientId);
      const updatedRecord = { ...existing, ...updateData };
      yield call([offlineDB, "put"], "patients", updatedRecord);
      yield call([offlineDB, "put"], "offlineQueue", {
        operation: "UPDATE",
        module: "patients",
        payload: { id: patientId, data: updateData },
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending"
      });
      yield put(updatePatientSuccess(updatedRecord));
      if (onSuccess) yield call(onSuccess, updatedRecord);
    } else {
      const errMsg = error.response?.data?.payload?.message || "Failed to update patient";
      yield put(updatePatientFailure(errMsg));
      if (onFailure) yield call(onFailure, errMsg);
    }
  }
}

function* handleDeletePatient(action) {
  const id = action.payload;
  try {
    if (!navigator.onLine) {
      yield call([offlineDB, "delete"], "patients", id);
      yield call([offlineDB, "put"], "offlineQueue", {
        operation: "DELETE",
        module: "patients",
        payload: id,
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending"
      });
      yield put(deletePatientSuccess(id));
      return;
    }

    yield call(patientAPI.deletePatient, id);
    yield call([offlineDB, "delete"], "patients", id);
    yield put(deletePatientSuccess(id));
  } catch (error) {
    const isNetworkError = !error.response;
    if (isNetworkError) {
      yield call([offlineDB, "delete"], "patients", id);
      yield call([offlineDB, "put"], "offlineQueue", {
        operation: "DELETE",
        module: "patients",
        payload: id,
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending"
      });
      yield put(deletePatientSuccess(id));
    } else {
      yield put(
        deletePatientFailure(
          error.response?.data?.payload?.message || "Failed to delete patient"
        )
      );
    }
  }
}

export default function* patientSaga() {
  yield takeLatest(fetchPatientsRequest.type, handleFetchPatients);
  yield takeLatest(fetchPatientByIdRequest.type, handleFetchPatientById);
  yield takeLatest(createPatientRequest.type, handleCreatePatient);
  yield takeLatest(updatePatientRequest.type, handleUpdatePatient);
  yield takeLatest(deletePatientRequest.type, handleDeletePatient);
}
