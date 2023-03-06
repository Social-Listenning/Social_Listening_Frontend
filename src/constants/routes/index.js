import { lazy } from 'react';

// #region public routes
const LoginPage = lazy(() =>
  import('../../screens/public/auth/LoginPage')
);
const RegisterPage = lazy(() =>
  import('../../screens/public/auth/RegisterPage')
);
const ConfirmEmailPage = lazy(() =>
  import('../../screens/public/auth/ConfirmEmailPage')
);
// #endregion

// #region private routes
const AdminPage = lazy(
  () => import('../../screens/accounts/AdminPage')
  // {
  //   return Promise.all([
  //     import('../../screens/accounts/AdminPage'),
  //     new Promise((resolve) => setTimeout(resolve, 50000)),
  //   ]).then(([moduleExports]) => moduleExports);
  // }
);
const ProfilePage = lazy(() =>
  import('../../screens/private/profile/ProfilePage')
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
  { path: 'confirm-email', element: <ConfirmEmailPage /> },
];

export const privateRoutes = [
  { path: 'admin', element: <AdminPage /> },
  { path: 'profile', element: <ProfilePage /> },
];

export const errorRoutes = [
  { path: '*', element: <ErrorPages /> },
  { path: '/forbidden', element: <ErrorPages status="403" /> },
];
