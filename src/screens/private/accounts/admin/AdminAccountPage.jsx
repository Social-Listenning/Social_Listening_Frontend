import { role } from '../../../../constants/profile/profile';
import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import { RoleChip } from '../../../../components/shared/element/Chip';
import DateTimeFormat from '../../../../components/shared/element/DateTimeFormat';
import AddEditAdminAccount from './AddEditAdminAccount';
import environment from '../../../../constants/environment/environment.dev';

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
      title: 'User Name',
      dataIndex: 'userName',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
    },
    {
      title: 'Date Modified',
      dataIndex: 'updatedAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
    },
  ];

  const permission = {
    table: 'table-user',
    new: 'create-user',
    import: 'import-user-admin',
    export: 'export-user',
  }

  return (
    <AdminTable
      apiGetData={environment.user}
      apiExport={`${environment.user}/export`}
      columns={columns}
      addEditComponent={<AddEditAdminAccount />}
      scroll={{ x: 2000 }}
      permission={permission}
    />
  );
}
