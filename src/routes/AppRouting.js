import { lazy } from 'react';

// #region public routes
const LoginPage = lazy(() =>
  import('../screens/public/auth/LoginPage')
);
const RegisterPage = lazy(() =>
  import('../screens/public/auth/RegisterPage')
);
const ConfirmEmailPage = lazy(() =>
  import('../screens/public/auth/ConfirmEmailPage')
);
// #endregion

// #region private routes
const HomePage = lazy(() =>
  import('../screens/private/home/HomePage')
);
const ProfilePage = lazy(() =>
  import('../screens/private/profile/ProfilePage')
);
const UserManagement = lazy(() =>
  import('../screens/private/accounts/user/UserPage')
);
const PermissionManagement = lazy(() =>
  import('../screens/private/accounts/permission/PermissionPage')
);
const RoleManagement = lazy(() =>
  import('../screens/private/accounts/role/RolePage')
);
const SocialNetworkPage = lazy(() =>
  import('../screens/private/social-network/SocialNetworkPage')
);
const SocialManagement = lazy(() =>
  import(
    '../screens/private/social-network/social-management/SocialManagePage'
  )
);
const SettingManagement = lazy(() =>
  import('../screens/private/setting/SettingPage')
);
// #endregion

// #region error routes
const ErrorPages = lazy(() =>
  import('../components/shared/antd/ErrorPage/ErrorPage')
);
// #endregion

export const publicRoutes = [
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'confirm-email', element: <ConfirmEmailPage /> },
];

export const privateRoutes = [
  { path: '/', element: <HomePage /> },
  { path: 'home', element: <HomePage /> },
  { path: 'profile', element: <ProfilePage /> },
  {
    path: 'account/user',
    element: <UserManagement />,
    permissionRequired: 'table-user',
  },
  {
    path: 'account/permission',
    element: <PermissionManagement />,
    permissionRequired: 'table-permission',
  },
  {
    path: 'account/role',
    element: <RoleManagement />,
    permissionRequired: 'get-role',
  },
  {
    path: 'social-network',
    element: <SocialNetworkPage />,
    permissionRequired: 'connect-social-network',
  },
  {
    path: 'social-network/:id',
    element: <SocialManagement />,
  },
  {
    path: 'setting',
    element: <SettingManagement />,
    permissionRequired: 'table-setting',
  },
];

export const errorRoutes = [
  { path: '*', element: <ErrorPages /> },
  { path: '/forbidden', element: <ErrorPages status="403" /> },
];
