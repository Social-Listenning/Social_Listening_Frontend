import { cloneElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useQueryClient, useMutation } from 'react-query';
import { getAllRole } from './privateService';
import useEffectOnce from '../../components/hooks/useEffectOnce';

export default function PermissionRoute({ roleRequired, element }) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData('userData');

  // #region call api to get data with permission
  const useGetAllRole = useMutation(getAllRole, {
    onSuccess: (resp) => {
      queryClient.setQueryData('allRole', resp);
    },
  });
  useEffectOnce(() => {
    // get all role from system
    if (userData?.permissions?.includes('get-role')) {
      useGetAllRole.mutate();
    }
  });
  // #endregion

  if (roleRequired) {
    const roleFromToken = userData?.role;

    if (roleFromToken !== roleRequired) {
      return <Navigate to={{ pathname: '/forbidden' }} />;
    }
  }

  const roleData = queryClient.getQueryData('allRole');

  return cloneElement(element, { roleData: roleData });
}
