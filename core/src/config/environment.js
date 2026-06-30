const getApiBaseUrl = () => {
  const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost/Task-012/backend/public';
  try {
    const url = new URL(base);
    // Preserve subdomain if we are not on root localhost
    if (window.location.hostname && window.location.hostname !== 'localhost') {
      url.hostname = window.location.hostname;
    }
    return url.toString().replace(/\/$/, '');
  } catch (e) {
    return base;
  }
};

const environment = {
  APP_NAME:    process.env.REACT_APP_NAME    || 'Healthcare SaaS',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  APP_ENV:     process.env.REACT_APP_ENV     || 'development',

  API_BASE_URL:    getApiBaseUrl(),
  REQUEST_TIMEOUT: Number(process.env.REACT_APP_API_TIMEOUT) || 30000,

  ACCESS_TOKEN_KEY: process.env.REACT_APP_ACCESS_TOKEN_KEY || 'access_token',
  CSRF_TOKEN_KEY:   process.env.REACT_APP_CSRF_TOKEN_KEY   || 'csrf_token',

  CSRF_HEADER:   process.env.REACT_APP_CSRF_HEADER   || 'X-CSRF-Token',

  ENABLE_ENCRYPTION: process.env.REACT_APP_ENABLE_ENCRYPTION === 'true',

  DEFAULT_THEME: process.env.REACT_APP_DEFAULT_THEME || 'dark',

  DEFAULT_PAGE_SIZE: Number(process.env.REACT_APP_DEFAULT_PAGE_SIZE) || 10,

  IDLE_TIMEOUT: Number(process.env.REACT_APP_IDLE_TIMEOUT) || 900000,

  ENABLE_LOGS: process.env.REACT_APP_ENABLE_LOGS === 'true',

  NOTIFICATION_DURATION: Number(process.env.REACT_APP_NOTIFICATION_DURATION) || 3000,
};

export default environment;
