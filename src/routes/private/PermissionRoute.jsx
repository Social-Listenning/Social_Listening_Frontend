import { Navigate } from 'react-router-dom';
import { useGetDecodedToken, useGetAllRole } from './privateService';

export default function PermissionRoute({ permissionRequired, element }) {
  const { data } = useGetDecodedToken();

  useGetAllRole(data?.permissions?.includes('get-role'));

  if (permissionRequired) {
    const permissionFromToken = data?.permissions;

    if (!permissionFromToken?.includes(permissionRequired)) {
      return <Navigate to={{ pathname: '/forbidden' }} />;
    }
  }

  return <>{element}</>;
}
