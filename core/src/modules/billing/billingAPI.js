import apiService from "../../services/apiService";
import API_ENDPOINTS from "../../config/apiEndpoints";

const billingAPI = {
  getInvoices() {
    return apiService.get(
      API_ENDPOINTS.BILLING.GET_ALL
    );
  },

  createInvoice(data) {
    return apiService.post(
      API_ENDPOINTS.BILLING.CREATE,
      data
    );
  },

  updateInvoice(id, data) {
    return apiService.put(
      `${API_ENDPOINTS.BILLING.UPDATE}/${id}`,
      data
    );
  },

  deleteInvoice(id) {
    return apiService.delete(
      `${API_ENDPOINTS.BILLING.DELETE}/${id}`
    );
  },
};

export default billingAPI;