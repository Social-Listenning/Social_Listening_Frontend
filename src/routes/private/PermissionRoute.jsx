import { Navigate } from 'react-router-dom';
import { useGetDecodedToken } from './privateService';

export default function PermissionRoute({ permissionRequired, element }) {
  const { data } = useGetDecodedToken();

  if (permissionRequired) {
    const permissionFromToken = data?.permissions;

    if (!permissionFromToken?.includes(permissionRequired)) {
      return <Navigate to={{ pathname: '/forbidden' }} />;
    }
  }

  return <>{element}</>;
}
