import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../modules/auth/authSlice";
import tenantReducer from "../modules/tenant/tenantSlice";
import securityReducer from "../modules/security/securitySlice";
import userReducer from "../modules/users/userSlice";
import chatReducer from "../modules/chat/chatSlice";
import billingReducer from "../modules/billing/billingSlice";
import prescriptionReducer from "../modules/prescriptions/prescriptionSlice";
import patientReducer from "../modules/patients/patientSlice";
import appointmentReducer from "../modules/appointments/appointmentSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  tenant: tenantReducer,
  security: securityReducer,
  users: userReducer,
  chat: chatReducer,
  billing: billingReducer,
  prescriptions: prescriptionReducer,
  patients: patientReducer,
  appointments: appointmentReducer,
});

export default rootReducer;