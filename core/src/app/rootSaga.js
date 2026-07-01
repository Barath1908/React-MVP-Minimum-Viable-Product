import { all } from "redux-saga/effects";

import authSaga from "../modules/auth/authSaga";
import tenantSaga from "../modules/tenant/tenantSaga";
import securitySaga from "../modules/security/securitySaga";
import userSaga from "../modules/users/userSaga";
import chatSaga from "../modules/chat/chatSaga";
import billingSaga from "../modules/billing/billingSaga";
import prescriptionSaga from "../modules/prescriptions/prescriptionSaga";

export default function* rootSaga() {
    yield all([
        authSaga(),
        tenantSaga(),
        securitySaga(),
        userSaga(),
        chatSaga(),
        billingSaga(),
        prescriptionSaga(),
    ]);
}