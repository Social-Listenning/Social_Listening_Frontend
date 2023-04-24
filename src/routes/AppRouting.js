import { lazy } from 'react';

// #region public routes
const LoginPage = lazy(() =>
  import('../screens/public/auth/login/LoginPage')
);
const RegisterPage = lazy(() =>
  import('../screens/public/auth/register/RegisterPage')
);
const RegisterSuccessPage = lazy(() =>
  import('../screens/public/auth/register/RegisterSuccessPage')
);
const VerifyEmailPage = lazy(() =>
  import('../screens/public/auth/register/VerifyEmailPage')
);
const ForgotPasswordPage = lazy(() =>
  import('../screens/public/auth/forgot-password/ForgotPasswordPage')
);
const ForgotPasswordStatus = lazy(() =>
  import('../screens/public/auth/forgot-password/ForgotPasswordStatus')
);
const ResetPasswordPage = lazy(() =>
  import('../screens/public/auth/forgot-password/ResetPasswordPage')
);
const ResetPasswordStatus = lazy(() =>
  import('../screens/public/auth/forgot-password/ResetPasswordStatus')
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
  { path: 'register-success', element: <RegisterSuccessPage /> },
  { path: 'confirm-email', element: <VerifyEmailPage /> },
  { path: 'forgot-password', element: <ForgotPasswordPage /> },
  { path: 'forgot-password-success', element: <ForgotPasswordStatus /> },
  { path: 'forgot-password-fail', element: <ForgotPasswordStatus /> },
  { path: 'recovery-password', element: <ResetPasswordPage /> },
  { path: 'recovery-password-success', element: <ResetPasswordStatus /> },
  { path: 'recovery-password-fail', element: <ResetPasswordStatus /> },
];

export const privateRoutes = [
  { path: '/', element: <></> },
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
    path: 'social-network/pages-management',
    element: <SocialNetworkPage />,
    permissionRequired: 'connect-social-network',
  },
  {
    path: 'social-network/:name',
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
