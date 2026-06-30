import apiService from "../../services/apiService";
import API_ENDPOINTS from "../../config/apiEndpoints";

const chatAPI = {
  getMessages() {
    return apiService.get(
      API_ENDPOINTS.CHAT.GET_ALL
    );
  },

  sendMessage(data) {
    return apiService.post(
      API_ENDPOINTS.CHAT.CREATE,
      data
    );
  },

  deleteMessage(id) {
    return apiService.delete(
      `${API_ENDPOINTS.CHAT.DELETE}/${id}`
    );
  },
};

export default chatAPI;