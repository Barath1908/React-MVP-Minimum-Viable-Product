import axiosClient from "../../services/axiosClient";

const userAPI = {
  fetchUsers: async () => {
    const response = await axiosClient.get("/auth/staff");
    return response.data;
  },

  addUser: async (data) => {
    const response = await axiosClient.post("/auth/staff", {
      payload: data,
    });
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await axiosClient.put(`/auth/staff/${id}`, {
      payload: data,
    });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosClient.delete(`/auth/staff/${id}`);
    return response.data;
  },
};

export default userAPI;
