export const selectAuth = (state) =>
  state.auth;

export const selectUser = (state) =>
  state.auth.user;

export const selectToken = (state) =>
  state.auth.token;

export const selectLoading = (state) =>
  state.auth.loading;

export const selectError = (state) =>
  state.auth.error;

export const selectIsAuthenticated = (state) =>
  state.auth.isAuthenticated;

// role comes from user.role — no tenant_id anymore
export const selectUserRole = (state) =>
  state.auth.user?.role || null;