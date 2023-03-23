import { role } from '../../../../constants/profile/profile';
import AdminTable from '../../../../components/shared/antd/Table/Table';
import { RoleChip } from '../../../../components/shared/element/Chip';

export default function RolePage() {
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
      title: 'Priority',
      dataIndex: 'level',
      disableFilter: true,
    },
    {
      title: 'Total User',
      dataIndex: '_count.Role_Permission',
      disableFilter: true,
    },
    {
      title: 'Total Permission',
      dataIndex: '_count.User',
      disableFilter: true,
    },
  ];

  return <AdminTable columns={columns} apiGetData="/role" />;
}
