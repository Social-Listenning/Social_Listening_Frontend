import { Navigate, Outlet } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { decodeToken } from 'react-jwt';
import { Checker } from '../../utils/dataChecker';
import { getSettingByKeyAndGroup } from '../../screens/private/setting/settingService';
import { updateBaseUrls } from '../../constants/environment/environment.dev';

export default function PrivateRoute() {
  let isAuth = true;
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  if (Checker.isNullOrEmpty(token)) {
    isAuth = false;
  }

  const decodedToken = decodeToken(token);
  if (Checker.isNullOrEmpty(decodedToken)) {
    isAuth = false;
  }

  if (isAuth) {
    queryClient.setQueryData('userData', decodedToken);
    Promise.all([
      getSettingByKeyAndGroup({
        key: 'DOMAIN_BACKEND',
        group: 'DOMAIN',
      }),
      getSettingByKeyAndGroup({
        key: 'DOMAIN_BOT',
        group: 'DOMAIN',
      }),
    ]).then(([backEndUrl, botUrl]) => {
      updateBaseUrls(backEndUrl?.value, botUrl?.value);
    });

    return <Outlet />;
  } else {
    return <Navigate to={{ pathname: '/login' }} />;
  }
}
