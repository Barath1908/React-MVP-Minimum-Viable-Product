import { combineReducers } from "redux";
import authReducer from "../modules/auth/authSlice";
import tenantReducer from "../modules/tenant/tenantSlice";
import securityReducer from "../modules/security/securitySlice";

const rootReducer = combineReducers({
    auth: authReducer,
    tenant: tenantReducer,
    security: securityReducer,
});

export default rootReducer;