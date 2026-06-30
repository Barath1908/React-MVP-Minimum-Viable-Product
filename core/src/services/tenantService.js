import axiosClient from './axiosClient';

const tenantService = {
  // Called on landing page — register a new hospital
  registerTenant: async (data) => {
    const response = await axiosClient.post('/tenant/register', {
      payload: data,
    });
    return response.data;
  },

  // Check if subdomain is available
  checkSubdomain: async (subdomain) => {
    const response = await axiosClient.get(`/tenant/check?subdomain=${subdomain}`);
    return response.data;
  },

  // Called by React on every subdomain page load
  // Returns { company_name, subdomain, theme, plan_type }
  getTenantConfig: async () => {
    const response = await axiosClient.get('/tenant/config');
    return response.data;
  },
};

export default tenantService;