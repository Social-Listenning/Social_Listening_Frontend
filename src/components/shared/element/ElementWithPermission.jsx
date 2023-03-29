import { useQueryClient } from 'react-query';

export default function ElementWithPermission(props) {
  const queryClient = useQueryClient();
  const permissionRequired = props.permission;

  if (permissionRequired) {
    const userData = queryClient.getQueryData('userData');
    const permissionList = userData?.permissions;

    if (permissionList?.includes(permissionRequired)) {
      return <>{props.children}</>;
    }
  }
  return;
}
