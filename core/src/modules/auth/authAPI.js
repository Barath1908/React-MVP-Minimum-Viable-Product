import axiosClient from "../../services/axiosClient";

const authAPI = {
  login: async (credentials) => {
    const response = await axiosClient.post("/auth/login", {
      payload: credentials,
    });
    return response.data;
  },

  register: async (data) => {
    const response = await axiosClient.post("/auth/register", {
      payload: data,
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post("/auth/logout");
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosClient.post("/auth/refresh");
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosClient.get("/auth/profile");
    return response.data;
  },

  changePassword: async (data) => {
    const response = await axiosClient.post("/auth/change-password", {
      payload: data,
    });
    return response.data;
  },
};

export default authAPI;