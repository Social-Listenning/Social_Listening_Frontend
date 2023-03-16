import { Navigate, Outlet } from 'react-router-dom';
import { Checker } from '../../utils/dataChecker';
import PrivateLayout from './PrivateLayout';

export default function PrivateRoute() {
  const token = localStorage.getItem('token');

  return Checker.isNullOrEmpty(token) ? (
    <Navigate to={{ pathname: '/login' }} />
  ) : (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  );
}
