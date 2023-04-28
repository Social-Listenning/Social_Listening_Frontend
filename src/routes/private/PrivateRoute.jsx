import { Navigate, Outlet } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { decodeToken } from 'react-jwt';
import { Checker } from '../../utils/dataChecker';
import { useSocket } from '../../components/contexts/socket/SocketProvider';
import useEffectOnce from '../../components/hooks/useEffectOnce';

export default function PrivateRoute() {
  let isAuth = true;
  const { connect } = useSocket();
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  if (Checker.isNullOrEmpty(token)) {
    isAuth = false;
  }

  const decodedToken = decodeToken(token);
  if (Checker.isNullOrEmpty(decodedToken)) {
    isAuth = false;
  }

  useEffectOnce(() => {
    if (isAuth) {
      connect();
    }
  });

  if (isAuth) {
    queryClient.setQueryData('userData', decodedToken);
    return <Outlet />;
  } else {
    return <Navigate to={{ pathname: '/login' }} />;
  }
}
