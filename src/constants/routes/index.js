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
const HomePage = lazy(() =>
  import('../../screens/private/home/HomePage')
);
const ProfilePage = lazy(() =>
  import('../../screens/private/profile/ProfilePage')
);
const AdminAccountManagement = lazy(() =>
  import('../../screens/private/accounts/admin/AdminAccountPage')
);
const OwnerAccountManagement = lazy(() =>
  import('../../screens/private/accounts/owner/OwnerAccountPage')
);
const PermissionManagement = lazy(() =>
  import('../../screens/private/accounts/permission/PermissionPage')
);
const RoleManagement = lazy(() =>
  import('../../screens/private/accounts/role/RolePage')
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
  { path: 'home', element: <HomePage /> },
  { path: 'profile', element: <ProfilePage /> },
  { path: 'account/admin', element: <AdminAccountManagement /> },
  { path: 'account/owner', element: <OwnerAccountManagement /> },
  { path: 'account/permission', element: <PermissionManagement /> },
  { path: 'account/role', element: <RoleManagement /> },
];

export const errorRoutes = [
  { path: '*', element: <ErrorPages /> },
  { path: '/forbidden', element: <ErrorPages status="403" /> },
];
