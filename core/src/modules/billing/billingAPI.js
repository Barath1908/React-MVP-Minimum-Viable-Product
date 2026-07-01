import axiosClient from "../../services/axiosClient";

const billingAPI = {
  listInvoices: async () => {
    const response = await axiosClient.get("/auth/billing/invoice");
    return response.data;
  },

  createInvoice: async (data) => {
    const response = await axiosClient.post("/auth/billing/invoice", {
      payload: data,
    });
    return response.data;
  },

  updateInvoice: async (id, data) => {
    const response = await axiosClient.put(`/auth/billing/invoice/${id}`, {
      payload: data,
    });
    return response.data;
  },

  recordPayment: async (data) => {
    const response = await axiosClient.post("/auth/billing/payment", {
      payload: data,
    });
    return response.data;
  },

  summary: async () => {
    const response = await axiosClient.get("/auth/billing/summary");
    return response.data;
  },
};

export default billingAPI;
