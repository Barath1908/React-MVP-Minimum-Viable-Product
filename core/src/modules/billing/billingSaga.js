import { call, put, takeLatest } from "redux-saga/effects";
import billingAPI from "./billingAPI";
import {
  fetchInvoicesRequest,
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  fetchSummaryRequest,
  fetchSummarySuccess,
  fetchSummaryFailure,
  createInvoiceRequest,
  createInvoiceSuccess,
  createInvoiceFailure,
  updateInvoiceRequest,
  updateInvoiceSuccess,
  updateInvoiceFailure,
  recordPaymentRequest,
  recordPaymentSuccess,
  recordPaymentFailure,
} from "./billingSlice";

function* handleFetchInvoices() {
  try {
    const response = yield call(billingAPI.listInvoices);
    const data = response?.payload?.data ?? response?.data ?? [];
    yield put(fetchInvoicesSuccess(data));
  } catch (error) {
    yield put(
      fetchInvoicesFailure(
        error.response?.data?.payload?.message || "Failed to fetch invoices"
      )
    );
  }
}

function* handleFetchSummary() {
  try {
    const response = yield call(billingAPI.summary);
    const data = response?.payload?.data ?? response?.data ?? null;
    yield put(fetchSummarySuccess(data));
  } catch (error) {
    yield put(
      fetchSummaryFailure(
        error.response?.data?.payload?.message || "Failed to fetch billing summary"
      )
    );
  }
}

function* handleCreateInvoice(action) {
  try {
    const response = yield call(billingAPI.createInvoice, action.payload);
    const data = response?.payload?.data ?? response?.data;
    yield put(createInvoiceSuccess(data));
    // Trigger summary update as well
    yield put(fetchSummaryRequest());
  } catch (error) {
    yield put(
      createInvoiceFailure(
        error.response?.data?.payload?.message || "Failed to generate invoice"
      )
    );
  }
}

function* handleUpdateInvoice(action) {
  try {
    const { id, ...data } = action.payload;
    const response = yield call(billingAPI.updateInvoice, id, data);
    const updated = response?.payload?.data ?? response?.data;
    yield put(updateInvoiceSuccess(updated));
    // Trigger summary update
    yield put(fetchSummaryRequest());
  } catch (error) {
    yield put(
      updateInvoiceFailure(
        error.response?.data?.payload?.message || "Failed to update invoice"
      )
    );
  }
}

function* handleRecordPayment(action) {
  try {
    yield call(billingAPI.recordPayment, action.payload);
    yield put(recordPaymentSuccess());
    // Payment recorded means invoices have changed status, reload list & summary
    yield put(fetchInvoicesRequest());
    yield put(fetchSummaryRequest());
  } catch (error) {
    yield put(
      recordPaymentFailure(
        error.response?.data?.payload?.message || "Failed to record payment"
      )
    );
  }
}

export default function* billingSaga() {
  yield takeLatest(fetchInvoicesRequest.type, handleFetchInvoices);
  yield takeLatest(fetchSummaryRequest.type, handleFetchSummary);
  yield takeLatest(createInvoiceRequest.type, handleCreateInvoice);
  yield takeLatest(updateInvoiceRequest.type, handleUpdateInvoice);
  yield takeLatest(recordPaymentRequest.type, handleRecordPayment);
}
