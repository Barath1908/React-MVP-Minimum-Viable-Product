/**
 * Detects subdomain from the current browser URL.
 *
 * localhost             → null  (landing page)
 * apollo.localhost:3000 → "apollo"
 * apollo.yourdomain.com → "apollo"
 */
const getTenantFromDomain = () => {
  const host  = window.location.hostname;
  const parts = host.split('.');

  if (parts.length === 1) {
    // plain "localhost" — landing page
    return null;
  }

  const sub = parts[0];

  // Ignore common non-tenant subdomains
  if (['www', 'app', 'api', 'mail'].includes(sub)) {
    return null;
  }

  return sub;
};

export default getTenantFromDomain;