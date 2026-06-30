import { call, put, takeLatest } from "redux-saga/effects";
import tokenService from "../../services/tokenService";
import authAPI from "./authAPI";

import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} from "./authSlice";

function* handleLogin(action) {
  try {
    const response = yield call(authAPI.login, action.payload);

    const csrfToken = response?.csrf_token;
    const data      = response?.payload?.data;

    if (data?.access_token) {
      tokenService.setAccessToken(data.access_token);
    }

    if (csrfToken) {
      tokenService.setCsrfToken(csrfToken);
    }

    if (data?.user) {
      tokenService.setUser(data.user);
    }

    yield put(loginSuccess(data));

  } catch (error) {
    yield put(
      loginFailure(
        error.response?.data?.payload?.message || "Login failed"
      )
    );
  }
}

function* handleLogout() {
  try {
    yield call(authAPI.logout);
    tokenService.clearAuth();
    yield put(logoutSuccess());
  } catch (error) {
    tokenService.clearAuth();
    yield put(
      logoutFailure(
        error.response?.data?.payload?.message || "Logout failed"
      )
    );
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(logoutRequest.type, handleLogout);
}