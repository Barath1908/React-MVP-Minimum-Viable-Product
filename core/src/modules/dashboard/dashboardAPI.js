import apiService from "../../services/apiService";
import API_ENDPOINTS from "../../config/apiEndpoints";

const dashboardAPI = {
  getSummary: () => {
    return apiService.get(API_ENDPOINTS.DASHBOARD_SUMMARY);
  },

};
export default dashboardAPI;