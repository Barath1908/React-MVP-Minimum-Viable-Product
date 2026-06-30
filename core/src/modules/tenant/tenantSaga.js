import { call, put, takeLatest } from 'redux-saga/effects';
import tenantService from '../../services/tenantService';
import { tenantRequest, tenantSuccess, tenantFailure, setLandingPage } from './tenantSlice';
import getTenantFromDomain from '../../utils/getTenantFromDomain';

function* handleTenantRequest() {
  try {
    // Detect subdomain in the browser using helper utility
    const subdomain = getTenantFromDomain();

    if (!subdomain) {
      // We are on the landing page
      yield put(setLandingPage(true));
      yield put(tenantSuccess(null));
      return;
    }

    // We are on a tenant subdomain — fetch config
    const response = yield call(tenantService.getTenantConfig);
    const config   = response?.payload?.data;

    if (!config) {
      throw new Error('Tenant not found');
    }

    yield put(tenantSuccess(config));
    yield put(setLandingPage(false));

  } catch (error) {
    yield put(tenantFailure(error.message || 'Failed to load tenant config'));
  }
}

export default function* tenantSaga() {
  yield takeLatest(tenantRequest.type, handleTenantRequest);
}