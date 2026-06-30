import { all } from "redux-saga/effects";

// import authSaga from "../modules/auth/authSaga";
import userSaga from "../modules/users/userSaga";
import staffSaga from "../modules/staff/staffSaga";
import roleSaga from "../modules/staffRoles/roleSaga";
import chatSaga from "../modules/chat/chatSaga";
import billingSaga from "../modules/billing/billingSaga";
import notificationSaga from "../modules/notifications/notificationSaga";
import prescriptionSaga from "../modules/prescriptions/prescriptionSaga";

export default function* rootSaga() {

  yield all([

    // authSaga(),
    userSaga(),
    staffSaga(),
    roleSaga(),
    chatSaga(),
    billingSaga(),
    notificationSaga(),
    prescriptionSaga(),

  ]);

}