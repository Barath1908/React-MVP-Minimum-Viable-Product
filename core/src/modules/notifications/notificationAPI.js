import apiService from "../../services/apiService";
import API_ENDPOINTS from "../../config/apiEndpoints";

const notificationAPI = {
  getNotifications() {
    return apiService.get(
      API_ENDPOINTS.NOTIFICATIONS.GET_ALL
    );
  },

  createNotification(data) {
    return apiService.post(
      API_ENDPOINTS.NOTIFICATIONS.CREATE,
      data
    );
  },

  deleteNotification(id) {
    return apiService.delete(
      `${API_ENDPOINTS.NOTIFICATIONS.DELETE}/${id}`
    );
  },
};

export default notificationAPI;