import apiService from "../../services/apiService";
import API_ENDPOINTS from "../../config/apiEndpoints";

const prescriptionAPI = {
  getPrescriptions() {
    return apiService.get(
      API_ENDPOINTS.PRESCRIPTIONS.GET_ALL
    );
  },

  createPrescription(data) {
    return apiService.post(
      API_ENDPOINTS.PRESCRIPTIONS.CREATE,
      data
    );
  },

  updatePrescription(id, data) {
    return apiService.put(
      `${API_ENDPOINTS.PRESCRIPTIONS.UPDATE}/${id}`,
      data
    );
  },

  deletePrescription(id) {
    return apiService.delete(
      `${API_ENDPOINTS.PRESCRIPTIONS.DELETE}/${id}`
    );
  },
};

export default prescriptionAPI;