import { createBrowserRouter } from 'react-router-dom';
import Login from '../views/pages/Login';
import Register from '../views/pages/Register';

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
]); 