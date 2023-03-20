import { role } from '../../../../constants/profile/profile';
import AdminTable from '../../../../components/shared/antd/Table/Table';
import { RoleChip } from '../../../../components/shared/element/Chip';
import AddEditPermissions from './AddEditPermissions';

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

  return (
    <AdminTable
      columns={columns}
      apiGetData="/permission"
      addEditComponent={<AddEditPermissions />}
      // scroll={{ x: 2000 }}
    />
  );
}
