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
const ProfilePage = lazy(() =>
  import('../../screens/private/profile/ProfilePage')
);
const UserManagementPage = lazy(() =>
  import('../../screens/private/admin/Users/UserManagementPage')
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
  { path: 'profile', element: <ProfilePage /> },
  { path: 'users', element: <UserManagementPage /> },
];

export const errorRoutes = [
  { path: '*', element: <ErrorPages /> },
  { path: '/forbidden', element: <ErrorPages status="403" /> },
];
