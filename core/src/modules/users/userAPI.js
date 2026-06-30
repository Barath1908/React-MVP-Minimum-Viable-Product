// import apiService from "../../services/apiService";
// import API_ENDPOINTS from "../../config/apiEndpoints";

// const userAPI = {

//     getUsers() {
//         return apiService.get(API_ENDPOINTS.USERS.GET_ALL);
//     },

//     getUser(id) {
//         return apiService.get(`${API_ENDPOINTS.USERS.GET_BY_ID}/${id}`);
//     },

//     createUser(data) {
//         return apiService.post(API_ENDPOINTS.USERS.CREATE, data);
//     },

//     updateUser(id, data) {
//         return apiService.put(`${API_ENDPOINTS.USERS.UPDATE}/${id}`, data);
//     },

//     deleteUser(id) {
//         return apiService.delete(`${API_ENDPOINTS.USERS.DELETE}/${id}`);
//     },

//     activateUser(id) {
//         return apiService.patch(`${API_ENDPOINTS.USERS.ACTIVATE}/${id}`);
//     },

//     deactivateUser(id) {
//         return apiService.patch(`${API_ENDPOINTS.USERS.DEACTIVATE}/${id}`);
//     }

// };

// export default userAPI;

import apiService from "../../services/apiService";
import API_ENDPOINTS from "../../config/apiEndpoints";

const userAPI = {
  getUsers() {
    return apiService.get(API_ENDPOINTS.USERS.GET_ALL);
  },

  createUser(data) {
    return apiService.post(API_ENDPOINTS.USERS.CREATE, data);
  },

  updateUser(id, data) {
    return apiService.put(
      `${API_ENDPOINTS.USERS.UPDATE}/${id}`,
      data
    );
  },

  deleteUser(id) {
    return apiService.delete(
      `${API_ENDPOINTS.USERS.DELETE}/${id}`
    );
  },
};

export default userAPI;