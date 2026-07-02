import { call, put, takeLatest } from "redux-saga/effects";
import appointmentAPI from "./appointmentAPI";
import offlineDB from "../../services/offlineDB";
import {
  fetchAppointmentsRequest,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  fetchAppointmentByIdRequest,
  fetchAppointmentByIdSuccess,
  fetchAppointmentByIdFailure,
  createAppointmentRequest,
  createAppointmentSuccess,
  createAppointmentFailure,
  updateAppointmentRequest,
  updateAppointmentSuccess,
  updateAppointmentFailure,
  deleteAppointmentRequest,
  deleteAppointmentSuccess,
  deleteAppointmentFailure,
} from "./appointmentSlice";

function* handleFetchAppointments(action) {
  const params = action.payload || {};
  try {
    if (!navigator.onLine) {
      const offlineData = yield call([offlineDB, "getAll"], "appointments");
      yield put(fetchAppointmentsSuccess(offlineData || []));
      return;
    }

    const response = yield call(appointmentAPI.listAppointments, params);
    const data = response?.payload?.data ?? response?.data ?? [];
    
    yield call([offlineDB, "clear"], "appointments");
    for (const appointment of data) {
      yield call([offlineDB, "put"], "appointments", appointment);
    }
    
    yield put(fetchAppointmentsSuccess(data));
  } catch (error) {
    try {
      const offlineData = yield call([offlineDB, "getAll"], "appointments");
      if (offlineData && offlineData.length > 0) {
        yield put(fetchAppointmentsSuccess(offlineData));
        return;
      }
    } catch (_) {}
    
    yield put(
      fetchAppointmentsFailure(
        error.response?.data?.payload?.message || "Failed to fetch appointments"
      )
    );
  }
}

function* handleFetchAppointmentById(action) {
  const id = action.payload;
  try {
    if (!navigator.onLine) {
      const offlineAppt = yield call([offlineDB, "get"], "appointments", id);
      if (offlineAppt) {
        yield put(fetchAppointmentByIdSuccess(offlineAppt));
        return;
      }
      throw new Error("Appointment not found offline");
    }

    const response = yield call(appointmentAPI.getAppointmentById, id);
    const data = response?.payload?.data ?? response?.data ?? null;
    if (data) {
      yield call([offlineDB, "put"], "appointments", data);
    }
    yield put(fetchAppointmentByIdSuccess(data));
  } catch (error) {
    try {
      const offlineAppt = yield call([offlineDB, "get"], "appointments", id);
      if (offlineAppt) {
        yield put(fetchAppointmentByIdSuccess(offlineAppt));
        return;
      }
    } catch (_) {}

    yield put(
      fetchAppointmentByIdFailure(
        error.response?.data?.payload?.message || error.message || "Failed to fetch appointment"
      )
    );
  }
}

function* handleCreateAppointment(action) {
  const { data, onSuccess, onFailure } = action.payload || {};
  const payloadData = data || action.payload;

  try {
    if (!navigator.onLine) {
      const tempId = -Date.now();
      const apptRecord = { 
        ...payloadData, 
        id: tempId,
        status: payloadData.status || "Scheduled", 
        created_at: new Date().toISOString() 
      };
      
      yield call([offlineDB, "put"], "appointments", apptRecord);
      
      const queueItem = {
        operation: "CREATE",
        module: "appointments",
        payload: payloadData,
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending",
        tempId: tempId
      };
      yield call([offlineDB, "put"], "offlineQueue", queueItem);
      
      yield put(createAppointmentSuccess(apptRecord));
      if (onSuccess) yield call(onSuccess, apptRecord);
      return;
    }

    const response = yield call(appointmentAPI.createAppointment, payloadData);
    const appointmentId = response?.payload?.data?.appointment_id;
    
    if (appointmentId) {
      const fetchResponse = yield call(appointmentAPI.getAppointmentById, appointmentId);
      const newAppt = fetchResponse?.payload?.data ?? fetchResponse?.data;
      
      if (newAppt) {
        yield call([offlineDB, "put"], "appointments", newAppt);
        yield put(createAppointmentSuccess(newAppt));
        if (onSuccess) yield call(onSuccess, newAppt);
      } else {
        yield put(fetchAppointmentsRequest());
        if (onSuccess) yield call(onSuccess);
      }
    } else {
      yield put(fetchAppointmentsRequest());
      if (onSuccess) yield call(onSuccess);
    }
  } catch (error) {
    const isNetworkError = !error.response;
    if (isNetworkError) {
      const tempId = -Date.now();
      const apptRecord = { 
        ...payloadData, 
        id: tempId,
        status: payloadData.status || "Scheduled", 
        created_at: new Date().toISOString() 
      };
      yield call([offlineDB, "put"], "appointments", apptRecord);
      yield call([offlineDB, "put"], "offlineQueue", {
        operation: "CREATE",
        module: "appointments",
        payload: payloadData,
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending",
        tempId: tempId
      });
      yield put(createAppointmentSuccess(apptRecord));
      if (onSuccess) yield call(onSuccess, apptRecord);
    } else {
      const errMsg = error.response?.data?.payload?.message || "Failed to book appointment";
      yield put(createAppointmentFailure(errMsg));
      if (onFailure) yield call(onFailure, errMsg);
    }
  }
}

function* handleUpdateAppointment(action) {
  const { id, data, onSuccess, onFailure } = action.payload || {};
  const apptId = id || action.payload?.id;
  const updateData = data || action.payload?.data || action.payload;

  try {
    if (!navigator.onLine) {
      const existing = yield call([offlineDB, "get"], "appointments", apptId);
      const updatedRecord = { ...existing, ...updateData };
      yield call([offlineDB, "put"], "appointments", updatedRecord);
      
      yield call([offlineDB, "put"], "offlineQueue", {
        operation: "UPDATE",
        module: "appointments",
        payload: { id: apptId, data: updateData },
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending"
      });
      
      yield put(updateAppointmentSuccess(updatedRecord));
      if (onSuccess) yield call(onSuccess, updatedRecord);
      return;
    }

    yield call(appointmentAPI.updateAppointment, apptId, updateData);
    const fetchResponse = yield call(appointmentAPI.getAppointmentById, apptId);
    const updated = fetchResponse?.payload?.data ?? fetchResponse?.data;
    
    if (updated) {
      yield call([offlineDB, "put"], "appointments", updated);
      yield put(updateAppointmentSuccess(updated));
      if (onSuccess) yield call(onSuccess, updated);
    } else {
      const fallbackUpdated = { ...updateData, id: apptId };
      yield call([offlineDB, "put"], "appointments", fallbackUpdated);
      yield put(updateAppointmentSuccess(fallbackUpdated));
      if (onSuccess) yield call(onSuccess, fallbackUpdated);
    }
  } catch (error) {
    const isNetworkError = !error.response;
    if (isNetworkError) {
      const existing = yield call([offlineDB, "get"], "appointments", apptId);
      const updatedRecord = { ...existing, ...updateData };
      yield call([offlineDB, "put"], "appointments", updatedRecord);
      yield call([offlineDB, "put"], "offlineQueue", {
        operation: "UPDATE",
        module: "appointments",
        payload: { id: apptId, data: updateData },
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending"
      });
      yield put(updateAppointmentSuccess(updatedRecord));
      if (onSuccess) yield call(onSuccess, updatedRecord);
    } else {
      const errMsg = error.response?.data?.payload?.message || "Failed to reschedule appointment";
      yield put(updateAppointmentFailure(errMsg));
      if (onFailure) yield call(onFailure, errMsg);
    }
  }
}

function* handleDeleteAppointment(action) {
  const id = action.payload;
  try {
    if (!navigator.onLine) {
      yield call([offlineDB, "delete"], "appointments", id);
      yield call([offlineDB, "put"], "offlineQueue", {
        operation: "DELETE",
        module: "appointments",
        payload: id,
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending"
      });
      yield put(deleteAppointmentSuccess(id));
      return;
    }

    yield call(appointmentAPI.deleteAppointment, id);
    yield call([offlineDB, "delete"], "appointments", id);
    yield put(deleteAppointmentSuccess(id));
  } catch (error) {
    const isNetworkError = !error.response;
    if (isNetworkError) {
      yield call([offlineDB, "delete"], "appointments", id);
      yield call([offlineDB, "put"], "offlineQueue", {
        operation: "DELETE",
        module: "appointments",
        payload: id,
        timestamp: Date.now(),
        retryCount: 0,
        status: "pending"
      });
      yield put(deleteAppointmentSuccess(id));
    } else {
      yield put(
        deleteAppointmentFailure(
          error.response?.data?.payload?.message || "Failed to cancel appointment"
        )
      );
    }
  }
}

export default function* appointmentSaga() {
  yield takeLatest(fetchAppointmentsRequest.type, handleFetchAppointments);
  yield takeLatest(fetchAppointmentByIdRequest.type, handleFetchAppointmentById);
  yield takeLatest(createAppointmentRequest.type, handleCreateAppointment);
  yield takeLatest(updateAppointmentRequest.type, handleUpdateAppointment);
  yield takeLatest(deleteAppointmentRequest.type, handleDeleteAppointment);
}
