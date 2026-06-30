import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useTheme } from './context/ThemeContext';
import { tenantRequest } from './modules/tenant/tenantSlice';
import AppRouter from './routes/AppRouter';
import useAuth from './modules/auth/hooks/useAuth';
import useIdleLogout from './hooks/useIdleLogout';
import GlobalStyles from './themes/GlobalStyles';

const AppContent = () => {
  const dispatch = useDispatch();
  const { logout, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  useIdleLogout(isAuthenticated ? logout : null);

  // Boot: detect subdomain and load tenant config
  useEffect(() => {
    dispatch(tenantRequest());
  }, [dispatch]);

  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      <AppRouter />
    </StyledThemeProvider>
  );
};

function App() {
  return <AppContent />;
}

export default App;