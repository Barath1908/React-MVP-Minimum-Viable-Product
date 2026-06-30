import axiosClient from "./axiosClient";

const apiService = {
  async get(url, config = {}) {
    return axiosClient.get(url, config);
  },

  async post(url, data = {}, config = {}) {
    return axiosClient.post(url, data, config);
  },

  async put(url, data = {}, config = {}) {
    return axiosClient.put(url, data, config);
  },

  async patch(url, data = {}, config = {}) {
    return axiosClient.patch(url, data, config);
  },

  async delete(url, config = {}) {
    return axiosClient.delete(url, config);
  },
};

export default apiService;