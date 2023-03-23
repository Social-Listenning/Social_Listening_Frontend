import { Navigate, Outlet } from 'react-router-dom';
import { Checker } from '../../utils/dataChecker';
import { useGetAllRole } from './privateService';
import PrivateLayout from './PrivateLayout';

export default function PrivateRoute() {
  const token = localStorage.getItem('token');
  const { error } = useGetAllRole();

  return Checker.isNullOrEmpty(token) ? (
    <Navigate to={{ pathname: '/login' }} />
  ) : (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  );
}
