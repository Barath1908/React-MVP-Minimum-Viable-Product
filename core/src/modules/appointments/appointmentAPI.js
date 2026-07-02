import axiosClient from "../../services/axiosClient";

const appointmentAPI = {
  listAppointments: async (params = {}) => {
    const response = await axiosClient.get("/appointments", { params });
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await axiosClient.get(`/appointments/${id}`);
    return response.data;
  },

  createAppointment: async (data) => {
    const response = await axiosClient.post("/appointments", { payload: data });
    return response.data;
  },

  updateAppointment: async (id, data) => {
    const response = await axiosClient.put(`/appointments/${id}`, { payload: data });
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await axiosClient.delete(`/appointments/${id}`);
    return response.data;
  },
};

export default appointmentAPI;
