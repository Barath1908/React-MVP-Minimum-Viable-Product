import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import ProtectedRoute   from './ProtectedRoute';
import RoleBasedRoute   from './RoleBasedRoute';
import { ROUTES, ROLES } from '../utils/constants';
import getTenantFromDomain from '../utils/getTenantFromDomain';

// Lazy load page components for code splitting
const LandingPage      = lazy(() => import('../pages/Landing/LandingPage'));
const LoginPage        = lazy(() => import('../pages/Auth/LoginPage'));
const RegisterPage     = lazy(() => import('../pages/Auth/RegisterPage'));
const DashboardPage    = lazy(() => import('../pages/Dashboard/DashboardPage'));
const UnauthorizedPage = lazy(() => import('../pages/Auth/UnauthorizedPage'));
const LogoutPage       = lazy(() => import('../pages/Auth/LogoutPage'));

// ── Styled Fallback Loader ──────────────────────────────────
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${({ theme }) => theme?.colors?.background || '#0f1117'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#e8eaf6'};
  font-family: 'Inter', sans-serif;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${({ theme }) => theme?.colors?.border || '#2a2d3e'};
  border-top: 3px solid ${({ theme }) => theme?.colors?.primary || '#4f8ef7'};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-bottom: 16px;
  box-shadow: 0 0 15px rgba(79, 142, 247, 0.15);
`;

const LoadingText = styled.div`
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#9094a6'};
`;

const LoadingFallback = () => (
  <SpinnerContainer>
    <Spinner />
    <LoadingText>Loading Workspace...</LoadingText>
  </SpinnerContainer>
);

const AppRouter = () => {
  const subdomain = getTenantFromDomain();
  const isLanding = !subdomain;

  // Landing page — show only landing routes
  if (isLanding) {
    return (
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }

  // Tenant subdomain — show full app
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path={ROUTES.LOGIN}          element={<LoginPage />} />
          <Route path={ROUTES.REGISTER}       element={<RegisterPage />} />

          <Route path={ROUTES.UNAUTHORIZED}   element={<UnauthorizedPage />} />
          <Route path={ROUTES.LOGOUT}         element={<LogoutPage />} />

          <Route
            path={ROUTES.HOME}
            element={<Navigate to={ROUTES.LOGIN} replace />}
          />

          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <RoleBasedRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.PROVIDER,
                    ROLES.NURSE,
                    ROLES.PHARMACIST,
                    ROLES.PATIENT,
                    ROLES.RECEPTIONIST,
                  ]}
                >
                  <DashboardPage />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;