import { call, put, take, delay } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import offlineDB from "../services/offlineDB";
import patientAPI from "./patients/patientAPI";
import appointmentAPI from "./appointments/appointmentAPI";
import { fetchPatientsRequest } from "./patients/patientSlice";
import { fetchAppointmentsRequest } from "./appointments/appointmentSlice";

function createOnlineChannel() {
  return eventChannel((emitter) => {
    const handleOnline = () => {
      emitter({ online: true });
    };
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  });
}

function* syncOfflineQueue() {
  if (!navigator.onLine) return;

  try {
    const queue = yield call([offlineDB, "getAll"], "offlineQueue");
    if (!queue || queue.length === 0) return;

    const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);

    for (const item of sortedQueue) {
      let success = false;
      try {
        if (item.module === "patients") {
          if (item.operation === "CREATE") {
            const response = yield call(patientAPI.createPatient, item.payload);
            const patientId = response?.payload?.data?.patient_id;
            if (patientId) {
              if (item.tempId) {
                yield call([offlineDB, "delete"], "patients", item.tempId);
              }
              const fetchResponse = yield call(patientAPI.getPatientById, patientId);
              const newPatient = fetchResponse?.payload?.data ?? fetchResponse?.data;
              if (newPatient) {
                yield call([offlineDB, "put"], "patients", newPatient);
              }
            }
            success = true;
          } else if (item.operation === "UPDATE") {
            const { id, data } = item.payload;
            yield call(patientAPI.updatePatient, id, data);
            success = true;
          } else if (item.operation === "DELETE") {
            yield call(patientAPI.deletePatient, item.payload);
            success = true;
          }
        } else if (item.module === "appointments") {
          if (item.operation === "CREATE") {
            const response = yield call(appointmentAPI.createAppointment, item.payload);
            const appointmentId = response?.payload?.data?.appointment_id;
            if (appointmentId) {
              if (item.tempId) {
                yield call([offlineDB, "delete"], "appointments", item.tempId);
              }
              const fetchResponse = yield call(appointmentAPI.getAppointmentById, appointmentId);
              const newAppt = fetchResponse?.payload?.data ?? fetchResponse?.data;
              if (newAppt) {
                yield call([offlineDB, "put"], "appointments", newAppt);
              }
            }
            success = true;
          } else if (item.operation === "UPDATE") {
            const { id, data } = item.payload;
            yield call(appointmentAPI.updateAppointment, id, data);
            success = true;
          } else if (item.operation === "DELETE") {
            yield call(appointmentAPI.deleteAppointment, item.payload);
            success = true;
          }
        }
      } catch (err) {
        const isNetworkError = !err.response;
        if (isNetworkError) {
          console.log("[offlineSyncSaga] Network offline during sync. Postponing...");
          break;
        } else {
          console.error("[offlineSyncSaga] Failed to sync queue item, removing:", item, err);
          success = true;
        }
      }

      if (success) {
        yield call([offlineDB, "delete"], "offlineQueue", item.id);
      }
    }

    yield put(fetchPatientsRequest());
    yield put(fetchAppointmentsRequest());

  } catch (error) {
    console.error("[offlineSyncSaga] Sync queue failed:", error);
  }
}

export default function* offlineSyncSaga() {
  yield delay(2000);
  yield call(syncOfflineQueue);

  const onlineChan = yield call(createOnlineChannel);
  try {
    while (true) {
      yield take(onlineChan);
      console.log("[offlineSyncSaga] Network back online. Starting sync...");
      yield call(syncOfflineQueue);
    }
  } finally {
    onlineChan.close();
  }
}
