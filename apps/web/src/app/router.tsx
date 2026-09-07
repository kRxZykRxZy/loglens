import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from '../components/errors/ErrorBoundary';
import { ProtectedRoute, PublicOnlyRoute } from '../features/auth/guards';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LoginPage } from '../features/auth/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { element: <ProtectedRoute />, children: [{ index: true, element: <DashboardPage /> }] },
      { element: <PublicOnlyRoute />, children: [{ path: 'login', element: <LoginPage /> }] },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
