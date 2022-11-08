import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';

const routes = [
  {
    element: (
        <MatxLayout />
    ),
    children: [...dashboardRoutes, ...materialRoutes],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="session/signin" /> },
];

export default routes;