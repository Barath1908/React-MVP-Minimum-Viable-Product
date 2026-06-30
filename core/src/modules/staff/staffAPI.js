import apiService from "../../services/apiService";

const staffAPI = {

    getStaff() {
        return apiService.get("/auth/staff");
    },

    getStaffById(id) {
        return apiService.get(`/auth/staff/${id}`);
    },

    createStaff(data) {
        return apiService.post("/auth/staff", data);
    },

    updateStaff(id, data) {
        return apiService.put(`/auth/staff/${id}`, data);
    },

    deleteStaff(id) {
        return apiService.delete(`/auth/staff/${id}`);
    }

};

export default staffAPI;