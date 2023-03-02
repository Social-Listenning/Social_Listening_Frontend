import { lazy } from 'react';

// #region public routes
const LoginPage = lazy(() => import('../../screens/auth/LoginPage'));
const RegisterPage = lazy(() =>
  import('../../screens/auth/RegisterPage')
);
// #endregion

// #region private routes
const AdminPage = lazy(() =>
  import('../../screens/accounts/AdminPage')
);
// #endregion

// #region error routes
const ErrorPages = lazy(() =>
  import('../../components/shared/antd/ErrorPage/ErrorPage')
);
// #endregion

export const publicRoutes = [
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
];

export const privateRoutes = [
  { path: 'admin', element: <AdminPage /> },
];

export const errorRoutes = [
  { path: '*', element: <ErrorPages /> },
  { path: '/forbidden', element: <ErrorPages status="403" /> },
];
