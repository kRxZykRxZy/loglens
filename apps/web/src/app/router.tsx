import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from '../components/errors/ErrorBoundary';
import { ProtectedRoute, PublicOnlyRoute } from '../features/auth/guards';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LoginPage } from '../features/auth/LoginPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../features/auth/VerifyEmailPage';
import { AccountSettingsPage } from '../features/account/AccountSettingsPage';
import { SessionsPage } from '../features/account/SessionsPage';
import { ProjectsPage } from '../features/projects/ProjectsPage';
import { ProjectOverviewPage } from '../features/projects/ProjectOverviewPage';
import { ProjectSettingsPage } from '../features/projects/ProjectSettingsPage';
import { ApiKeysPage } from '../features/projects/ApiKeysPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'projects/:projectId', element: <ProjectOverviewPage /> },
          { path: 'projects/:projectId/settings', element: <ProjectSettingsPage /> },
          { path: 'projects/:projectId/keys', element: <ApiKeysPage /> },
          { path: 'account/settings', element: <AccountSettingsPage /> },
          { path: 'account/sessions', element: <SessionsPage /> },
        ],
      },
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          { path: 'verify-email', element: <VerifyEmailPage /> },
        ],
      },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
