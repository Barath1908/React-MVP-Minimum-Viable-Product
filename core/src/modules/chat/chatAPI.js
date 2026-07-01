import axiosClient from "../../services/axiosClient";

const chatAPI = {
  getAppointmentMessages: async (appointmentId) => {
    const response = await axiosClient.get(`/auth/message/appointment/${appointmentId}`);
    return response.data;
  },

  sendMessage: async (data) => {
    const response = await axiosClient.post("/auth/message", {
      payload: data,
    });
    return response.data;
  },

  markRead: async (messageId) => {
    const response = await axiosClient.put(`/auth/message/${messageId}/read`);
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const response = await axiosClient.delete(`/auth/message/${messageId}`);
    return response.data;
  },
};

export default chatAPI;
