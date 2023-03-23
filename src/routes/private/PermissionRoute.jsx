import { Outlet, Navigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

export default function PermissionRoute({ roleRequired }) {
  if (roleRequired) {
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    const roleFromToken = decodedToken.role;

    if (roleFromToken !== roleRequired) {
      return <Navigate to={{ pathname: '/forbidden' }} />;
    }
  }

  return <Outlet />;
}
