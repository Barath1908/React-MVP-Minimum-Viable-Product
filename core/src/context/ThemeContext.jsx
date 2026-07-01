import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import environment from '../config/environment';
import darkTheme   from '../themes/darkTheme';
import warmTheme   from '../themes/warmTheme';
import lightTheme  from '../themes/lightTheme';
import getTenantFromDomain from '../utils/getTenantFromDomain';

const ThemeContext = createContext();

const themeMap = {
  dark:  darkTheme,
  warm:  warmTheme,
  light: lightTheme,
};

export const ThemeProvider = ({ children }) => {
  const tenantConfig = useSelector((state) => state.tenant?.tenant);
  const subdomain = getTenantFromDomain();

  const [themeName, setThemeName] = useState(() => {
    const isLanding = !subdomain;
    if (isLanding) {
      return 'light';
    }
    return localStorage.getItem('theme') || environment.DEFAULT_THEME;
  });

  // Sync theme from tenant config when it loads (only for subdomains)
  useEffect(() => {
    if (tenantConfig?.theme && subdomain) {
      setThemeName(tenantConfig.theme);
      localStorage.setItem('theme', tenantConfig.theme);
    }
  }, [tenantConfig?.theme, subdomain]);

  // Keep landing page on light theme when subdomain is absent
  useEffect(() => {
    if (!subdomain) {
      setThemeName('light');
    }
  }, [subdomain]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeName);
  }, [themeName]);

  const toggleTheme = useCallback(() => {
    const order  = ['dark', 'light', 'warm'];
    const idx    = order.indexOf(themeName);
    const next   = order[(idx + 1) % order.length];
    setThemeName(next);
    localStorage.setItem('theme', next);
  }, [themeName]);

  const changeTheme = useCallback((name) => {
    if (themeMap[name]) {
      setThemeName(name);
      localStorage.setItem('theme', name);
    }
  }, []);

  const themeObject = themeMap[themeName] || darkTheme;

  const value = useMemo(
    () => ({
      theme:      themeObject,
      themeName,
      toggleTheme,
      changeTheme,
      isDarkMode: themeName === 'dark',
    }),
    [themeObject, themeName, toggleTheme, changeTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export default ThemeContext;