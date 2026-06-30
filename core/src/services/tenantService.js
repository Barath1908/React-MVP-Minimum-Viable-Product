const tenantService = {

  getTenant() {

    const hostname = window.location.hostname;

    if (hostname.includes("hospitala")) {
      return "tenant_001";
    }

    if (hostname.includes("hospitalb")) {
      return "tenant_002";
    }

    return "tenant_001";
  },

};

export default tenantService;