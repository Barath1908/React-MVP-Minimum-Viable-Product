import { call, put, takeLatest } from "redux-saga/effects";

import {
  securityRequest,
  securitySuccess,
  securityFailure,
  setCsrfToken,
  setSessionExpired,
  setTokenValid,
} from "./securitySlice";

import tokenService from "../../services/tokenService";
import { logoutSuccess } from "../auth/authSlice";

// ─── Helpers ──────────────────────────────────────────────

/**
 * Decodes JWT payload without verification (client-side only).
 * Verification is done server-side via AuthMiddleware.
 * We only read exp/type claims here for local checks.
 */
function decodeJwtPayload(token) {
  try {
    const base64Payload = token.split(".")[1];
    // atob requires standard base64 — JWT uses base64url, so we normalize
    const normalized = base64Payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Returns true if the JWT exp claim is in the past.
 * Backend sets ACCESS_TOKEN_EXPIRY = 900 seconds (15 min).
 * exp is Unix timestamp in seconds — Date.now() is milliseconds.
 */
function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp < nowInSeconds;
}

/**
 * Returns true if the JWT type claim is "access".
 * Backend JWT.php sets type: TOKEN_ACCESS = "access".
 * Guards against accidentally using a refresh token as access token.
 */
function isCorrectTokenType(token) {
  const payload = decodeJwtPayload(token);
  return payload?.type === "access";
}

// ─── Validation Steps ─────────────────────────────────────

/**
 * STEP 1 — CSRF Token Validation
 *
 * What the backend does:
 *   - CSRF::generate() creates a token stored in PHP $_SESSION
 *   - Every response includes csrf_token at the top level
 *   - CsrfMiddleware::handle() reads X-CSRF-Token header and validates
 *     against $_SESSION via hash_equals()
 *   - Excluded routes: /auth/register, /auth/login, /auth/logout
 *
 * What we check here:
 *   - Token exists in localStorage (tokenService.getCsrfToken())
 *   - Token is a non-empty string (basic format check)
 *   - If missing, the next API call to any protected route will
 *     get a 403 "CSRF token missing" from CsrfMiddleware
 *
 * Note: We cannot verify the token against the server here because
 * there is no dedicated /auth/csrf/validate endpoint. The real
 * validation happens per-request in CsrfMiddleware on the backend.
 */
function* validateCsrfToken() {
  const csrfToken = yield call(
    [tokenService, tokenService.getCsrfToken]
  );

  if (!csrfToken || typeof csrfToken !== "string" || csrfToken.trim() === "") {
    throw new Error(
      "CSRF token is missing from storage. " +
      "This may indicate a tampered session or first-load issue."
    );
  }

  // Sync the validated token into Redux so axiosClient can read it
  // axiosClient reads from tokenService directly, but this keeps
  // Redux state in sync for any components that need to display status
  yield put(setCsrfToken(csrfToken));

  return csrfToken;
}

/**
 * STEP 2 — Access Token Validation
 *
 * What the backend does:
 *   - AuthMiddleware::handle() reads Authorization: Bearer <token>
 *   - JWT::validate() checks HS256 signature + exp claim
 *   - Checks token type === TOKEN_ACCESS ("access")
 *   - Checks tenant is still active in DB
 *   - Returns 401 if missing/expired/invalid
 *
 * What we check here (client-side, no server call):
 *   - Token exists in localStorage
 *   - Token type is "access" (guards against refresh token misuse)
 *   - Token exp claim has not passed locally
 *
 * Why no server call:
 *   - There is no /auth/validate endpoint in api.php
 *   - Every protected API call already validates the token server-side
 *   - Making a dummy API call just to validate would waste a round trip
 *   - axiosClient already redirects to /login on 401 responses
 */
function* validateAccessToken() {
  const accessToken = yield call(
    [tokenService, tokenService.getAccessToken]
  );

  // Token missing entirely
  if (!accessToken) {
    yield put(setTokenValid(false));
    yield put(setSessionExpired(true));
    throw new Error(
      "Access token is missing. User needs to log in."
    );
  }

  // Wrong token type — guard against refresh token being stored in wrong key
  if (!isCorrectTokenType(accessToken)) {
    yield put(setTokenValid(false));
    throw new Error(
      "Invalid token type in storage. Expected access token."
    );
  }

  // Token has expired locally — exp < now
  // Backend ACCESS_TOKEN_EXPIRY = 900 seconds (15 min) from .env
  if (isTokenExpired(accessToken)) {
    yield put(setTokenValid(false));
    yield put(setSessionExpired(true));
    throw new Error(
      "Access token has expired. Please log in again."
    );
  }

  yield put(setTokenValid(true));
  return accessToken;
}

/**
 * STEP 3 — Session / User Integrity Check
 *
 * What the backend does:
 *   - On login: AuthService::issueTokens() stores user in the
 *     login response payload.data.user
 *   - authSaga stores this via tokenService.setUser(data.user)
 *   - User object contains: id, role, email, fullName
 *
 * What we check here:
 *   - User object exists in localStorage (not null/undefined)
 *   - Required fields are present (id, role)
 *   - Guards against partial/corrupted auth state where token
 *     exists but user data was lost or corrupted
 *
 * Why tenant configuration matters:
 *   - Every backend query is tenant-scoped via the subdomain detection
 */

function* validateSession() {
  const user = yield call(
    [tokenService, tokenService.getUser]
  );

  if (!user) {
    yield put(setSessionExpired(true));
    throw new Error(
      "Session is invalid. No user found in storage. Please log in again."
    );
  }

  // tenant_id removed — only check id and role now
  const requiredFields = ["id", "role"];
  const missingFields  = requiredFields.filter((field) => !user[field]);

  if (missingFields.length > 0) {
    yield put(setSessionExpired(true));
    throw new Error(
      `Session user object is missing fields: ${missingFields.join(", ")}. Storage may be corrupted.`
    );
  }

  yield put(setSessionExpired(false));
  return user;
}

// ─── Main Handler ─────────────────────────────────────────

/**
 * Runs all three security checks in sequence.
 *
 * Order matters:
 *   1. CSRF first — cheapest check, detects missing session token
 *   2. JWT second — most common failure path (expiry)
 *   3. Session last — catches corrupted storage state
 *
 * Where to dispatch securityRequest():
 *   - ProtectedRoute.jsx → before rendering any protected page
 *   - App.jsx useEffect → on app boot if isAuthenticated is true
 *   - Before sensitive mutations (password change, billing actions)
 *
 * On failure:
 *   - securityFailure sets state.security.error in Redux
 *   - ProtectedRoute can read this and redirect to /login
 *   - useSecurity() hook exposes the error to components
 */
function* handleSecurityRequest() {
  try {
    yield call(validateCsrfToken);    // Step 1 — CSRF presence check
    yield call(validateAccessToken);  // Step 2 — JWT type + expiry
    yield call(validateSession);      // Step 3 — User object integrity

    yield put(securitySuccess());

  } catch (error) {
    yield call([tokenService, tokenService.clearAuth]);
    yield put(logoutSuccess());
    yield put(
      securityFailure(
        error.message || "Security validation failed"
      )
    );
  }
}

// ─── Watcher ──────────────────────────────────────────────

export default function* securitySaga() {
  yield takeLatest(securityRequest.type, handleSecurityRequest);
}