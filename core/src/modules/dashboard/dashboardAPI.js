import axiosClient from "../../services/axiosClient";

const dashboardAPI = {
  getSummary: () => axiosClient.get("/dashboard/summary"),
};

export default dashboardAPI;