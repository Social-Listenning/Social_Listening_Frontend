import { Navigate } from 'react-router-dom';
import { useGetDecodedToken } from './privateService';
import PrivateLayout from './PrivateLayout';

export default function PermissionRoute({
  permissionRequired,
  element,
  noLayout = false,
}) {
  const { data } = useGetDecodedToken();

  if (permissionRequired) {
    const permissionFromToken = data?.permissions;

    if (!permissionFromToken?.includes(permissionRequired)) {
      return <Navigate to={{ pathname: '/forbidden' }} />;
    }
  }

  if (noLayout) {
    return <>{element}</>;
  }

  return <PrivateLayout>{element}</PrivateLayout>;
}
