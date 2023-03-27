import { MinusOutlined } from '@ant-design/icons';
import { role } from '../../../../constants/profile/profile';
import AdminTable from '../../../../components/shared/antd/Table/Table';
import { RoleChip } from '../../../../components/shared/element/Chip';
import AddEditPermissions from './AddEditPermissions';
import { useMutation } from 'react-query';
import { removePermission } from '../accountService';
import { notifyService } from '../../../../services/notifyService';

export default function PermissionManangement() {
  const columns = [
    {
      title: 'Role',
      dataIndex: 'role.roleName',
      required: true,
      fixed: true,
      sort: false,
      filter: {
        filterType: 'Dropdown',
        options: role,
      },
      render: (record) => {
        return <RoleChip currentRole={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
    },
    {
      title: 'Permission Name',
      dataIndex: 'permission.displayName',
    },
    {
      title: 'Permission Key',
      dataIndex: 'permission.permission',
    },
    {
      title: 'Screen',
      dataIndex: 'permission.screen',
    },
  ];

  const permission = {
    table: 'table-permission',
    new: 'assign-permission',
  };

  const useRemovePermission = useMutation(removePermission, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Remove permission successfully',
        });
      }
    },
  });
  
  function handleActionClick(action, data) {
    if (action === 'Remove') {
      useRemovePermission.mutate({
        roleId: data?.role?.id,
        permissionId: data?.permission?.id,
      });
      return true;
    }
    
    return false;
  }

  return (
    <AdminTable
      columns={columns}
      apiGetData="/permission"
      addEditComponent={<AddEditPermissions />}
      permission={permission}
      actionList={[{ icon: <MinusOutlined />, action: 'Remove' }]}
      handleActionClick={handleActionClick}
    />
  );
}
