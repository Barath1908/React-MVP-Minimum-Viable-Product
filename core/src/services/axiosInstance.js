import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost/Task-012/backend/public",
  timeout: 30000,
});

export default axiosInstance;