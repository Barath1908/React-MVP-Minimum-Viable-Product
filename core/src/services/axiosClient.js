import axios from "axios";

import environment from "../config/environment";

import tokenService from "./tokenService";

import tenantService from "./tenantService";

const axiosClient = axios.create({

  baseURL: environment.API_BASE_URL,

  timeout: 15000,

  headers: {

    "Content-Type": "application/json",

  },

});

axiosClient.interceptors.request.use(

  (config) => {

    const token = tokenService.getToken();

    const tenantId = tenantService.getTenant();

    if (token) {

      config.headers.Authorization = `Bearer ${token}`;

    }

    config.headers["X-Tenant-ID"] = tenantId;

    return config;

  },

  (error) => Promise.reject(error)

);

axiosClient.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response) {

      switch (error.response.status) {

        case 401:

          console.log("Unauthorized");

          tokenService.removeToken();

          break;

        case 403:

          console.log("Forbidden");

          break;

        case 404:

          console.log("API Not Found");

          break;

        case 500:

          console.log("Internal Server Error");

          break;

        default:

          console.log(error.response.data.message);

      }

    }

    return Promise.reject(error);

  }

);

export default axiosClient;