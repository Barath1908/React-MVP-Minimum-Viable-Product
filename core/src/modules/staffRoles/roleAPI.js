import apiService from "../../services/apiService";
import API_ENDPOINTS from "../../config/apiEndpoints";

const roleAPI = {
  getRoles() {
    return apiService.get(
      API_ENDPOINTS.ROLES.GET_ALL
    );
  },

  createRole(data) {
    return apiService.post(
      API_ENDPOINTS.ROLES.CREATE,
      data
    );
  },

  updateRole(id, data) {
    return apiService.put(
      `${API_ENDPOINTS.ROLES.UPDATE}/${id}`,
      data
    );
  },

  deleteRole(id) {
    return apiService.delete(
      `${API_ENDPOINTS.ROLES.DELETE}/${id}`
    );
  },
};

export default roleAPI;