import axiosClient from "../../services/axiosClient";

const patientAPI = {
  listPatients: async () => {
    const response = await axiosClient.get("/patients");
    return response.data;
  },

  getPatientById: async (id) => {
    const response = await axiosClient.get(`/patients/${id}`);
    return response.data;
  },

  createPatient: async (data) => {
    const response = await axiosClient.post("/patients", { payload: data });
    return response.data;
  },

  updatePatient: async (id, data) => {
    const response = await axiosClient.put(`/patients/${id}`, { payload: data });
    return response.data;
  },

  deletePatient: async (id) => {
    const response = await axiosClient.delete(`/patients/${id}`);
    return response.data;
  },
};

export default patientAPI;
