import {
  call,
  put,
  takeLatest,
} from "redux-saga/effects";

import billingAPI from "./billingAPI";

import {
  fetchInvoicesRequest,
  fetchInvoicesSuccess,
  fetchInvoicesFailure,

  createInvoiceRequest,
  createInvoiceSuccess,
  createInvoiceFailure,

  updateInvoiceRequest,
  updateInvoiceSuccess,
  updateInvoiceFailure,

  deleteInvoiceRequest,
  deleteInvoiceSuccess,
  deleteInvoiceFailure,
} from "./billingSlice";

function* fetchInvoicesSaga() {
  try {
    const response = yield call(
      billingAPI.getInvoices
    );

    yield put(
      fetchInvoicesSuccess(
        response.data
      )
    );
  } catch (error) {
    yield put(
      fetchInvoicesFailure(
        error.response?.data
          ?.message ||
          error.message
      )
    );
  }
}

function* createInvoiceSaga(
  action
) {
  try {
    yield call(
      billingAPI.createInvoice,
      action.payload
    );

    yield put(
      createInvoiceSuccess()
    );

    yield put(
      fetchInvoicesRequest()
    );
  } catch (error) {
    yield put(
      createInvoiceFailure(
        error.response?.data
          ?.message ||
          error.message
      )
    );
  }
}

function* updateInvoiceSaga(
  action
) {
  try {
    const { id, data } =
      action.payload;

    yield call(
      billingAPI.updateInvoice,
      id,
      data
    );

    yield put(
      updateInvoiceSuccess()
    );

    yield put(
      fetchInvoicesRequest()
    );
  } catch (error) {
    yield put(
      updateInvoiceFailure(
        error.response?.data
          ?.message ||
          error.message
      )
    );
  }
}

function* deleteInvoiceSaga(
  action
) {
  try {
    yield call(
      billingAPI.deleteInvoice,
      action.payload
    );

    yield put(
      deleteInvoiceSuccess()
    );

    yield put(
      fetchInvoicesRequest()
    );
  } catch (error) {
    yield put(
      deleteInvoiceFailure(
        error.response?.data
          ?.message ||
          error.message
      )
    );
  }
}

export default function* billingSaga() {
  yield takeLatest(
    fetchInvoicesRequest.type,
    fetchInvoicesSaga
  );

  yield takeLatest(
    createInvoiceRequest.type,
    createInvoiceSaga
  );

  yield takeLatest(
    updateInvoiceRequest.type,
    updateInvoiceSaga
  );

  yield takeLatest(
    deleteInvoiceRequest.type,
    deleteInvoiceSaga
  );
}