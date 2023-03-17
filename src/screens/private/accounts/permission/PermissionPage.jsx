import AdminTable from '../../../../components/shared/antd/Table/Table';
import AddEditPermissions from './AddEditPermissions'

export default function PermissionManangement() {
  const columns = [
    {
      title: 'Role',
      dataIndex: 'role.roleName',
      required: true,
      fixed: true,
    },
    {
      title: 'Permission Name',
      dataIndex: 'permissionName',
    },
    {
      title: 'Permission Key',
      dataIndex: 'permissionKey',
    },
    {
      title: 'Screen',
      dataIndex: 'screen',
    },
  ];

  return (
    <AdminTable
      columns={columns}
      addEditComponent={<AddEditPermissions />}
      // scroll={{ x: 2000 }}
    />
  );
}
