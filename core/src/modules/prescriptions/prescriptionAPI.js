import axiosClient from "../../services/axiosClient";

const prescriptionAPI = {
  listPrescriptions: async () => {
    const response = await axiosClient.get("/auth/prescription");
    return response.data;
  },

  createPrescription: async (data) => {
    const response = await axiosClient.post("/auth/prescription", {
      payload: data,
    });
    return response.data;
  },

  getPrescription: async (id) => {
    const response = await axiosClient.get(`/auth/prescription/${id}`);
    return response.data;
  },

  verifyPrescription: async (id) => {
    const response = await axiosClient.put(`/auth/prescription/${id}/verify`);
    return response.data;
  },

  dispensePrescription: async (id) => {
    const response = await axiosClient.put(`/auth/prescription/${id}/dispense`);
    return response.data;
  },
};

export default prescriptionAPI;
