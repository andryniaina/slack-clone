import { createBrowserRouter } from 'react-router-dom';
import Login from '../views/pages/Login';
import Register from '../views/pages/Register';
import Dashboard from '../views/pages/Dashboard';
import AuthenticatedLayout from '../views/layouts/AuthenticatedLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/app',
    element: <AuthenticatedLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
]); 