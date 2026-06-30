// src/app/rootSaga.js

import { all } from "redux-saga/effects";

import authSaga from "../modules/auth/authSaga";
import tenantSaga from "../modules/tenant/tenantSaga";
import securitySaga from "../modules/security/securitySaga";

export default function* rootSaga() {
    yield all([
        authSaga(),
        tenantSaga(),
        securitySaga(),
    ]);
}