import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Login from '../views/pages/Login';
import Register from '../views/pages/Register';
import Dashboard from '../views/pages/Dashboard';
import DirectMessages from '../views/pages/Directs';
import Activity from '../views/pages/Activity';
import AuthenticatedLayout from '../views/layouts/AuthenticatedLayout';
import { AuthProvider } from '../contexts/AuthContext';
import { AuthService } from '../services/auth';
import { WebSocketProvider } from '../contexts/WebSocketContext';

function ProtectedRoute() {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicRoute() {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}

function Root() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Outlet />
      </WebSocketProvider>
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/',
            element: <Navigate to="/login" replace />,
          },
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/register',
            element: <Register />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/app',
            element: <AuthenticatedLayout />,
            children: [
              {
                path: 'dashboard',
                element: <Dashboard />,
              },
              {
                path: 'directs',
                element: <DirectMessages />,
              },
              {
                path: 'activity',
                element: <Activity />,
              },
            ],
          },
        ],
      },
    ],
  },
]); 