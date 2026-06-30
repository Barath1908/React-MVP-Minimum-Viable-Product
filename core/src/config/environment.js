const environment = {

  development: {
    API_BASE_URL: "http://localhost/healthcare-api",
    APP_NAME: "Healthcare SaaS",
    ENV: "development",
  },

  production: {
    API_BASE_URL: "https://api.healthcare.com",
    APP_NAME: "Healthcare SaaS",
    ENV: "production",
  },
};

const currentEnv =
  process.env.NODE_ENV === "production"
    ? environment.production
    : environment.development;

export default currentEnv;