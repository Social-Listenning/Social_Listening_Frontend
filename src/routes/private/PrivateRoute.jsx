import { Navigate, Outlet } from 'react-router-dom';
import { localStorageService } from '../../services/localStorageService';
import { Checker } from '../../utils/dataChecker';
import PrivateLayout from './PrivateLayout';

export default function PrivateRoute() {
  const token = localStorageService.getItem('token');

  return Checker.isNullOrEmpty(token) ? (
    <Navigate to={{ pathname: '/login' }} />
  ) : (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  );
}
