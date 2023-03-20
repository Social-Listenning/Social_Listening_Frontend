import { role } from '../../../../constants/profile/profile';
import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import { RoleChip } from '../../../../components/shared/element/Chip';
import AddEditAdminAccount from './AddEditAdminAccount';

export default function AdminAccountManagement() {
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      required: true,
      fixed: true,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      filter: {
        filterType: 'Boolean',
      },
      render: (record) => {
        return <BooleanRow active={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
      sort: false,
      resizeable: false,
      width: 100,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      required: true,
    },
    {
      title: 'Role',
      dataIndex: 'role.roleName',
      required: true,
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
      title: 'Full Name',
      dataIndex: 'fullName',
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      render: (record) => {
        const dateFormat = new Date(record).toLocaleDateString();
        return <span>{dateFormat}</span>;
      },
    },
    {
      title: 'Date Modified',
      dataIndex: 'updatedAt',
      render: (record) => {
        const dateFormat = new Date(record).toLocaleDateString();
        return <span>{dateFormat}</span>;
      },
    },
  ];

  return (
    <AdminTable
      apiGetData="/user"
      columns={columns}
      addEditComponent={<AddEditAdminAccount />}
      scroll={{ x: 2000 }}
    />
  );
}
