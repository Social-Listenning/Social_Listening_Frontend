import { role } from '../../../../constants/profile/profile';
import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import { RoleChip } from '../../../../components/shared/element/Chip';
import DateTimeFormat from '../../../../components/shared/element/DateTimeFormat';
import AddEditOwnerAccount from './AddEditOwnerAccount';

const roleData = role.slice(1);
export default function OwnerAccountManagement() {
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
        options: roleData,
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

  const importColumns = [
    {
      title: 'Email',
      dataIndex: 'email',
      required: true,
    },
    {
      title: 'Password',
      dataIndex: 'password',
      required: true,
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      required: true,
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
  ];

  const dumpImportData = [
    {
      email: 'user1@gmail.com',
      password: 'secret-password',
      roleName: 'MANAGER',
    },
    {
      email: 'user2@gmail.com',
      password: 'secret-password',
      roleName: 'SUPPORTER',
    },
  ];

  return (
    <AdminTable
      columns={columns}
      apiGetData="/user/all"
      importColumns={importColumns}
      dumpImportData={dumpImportData}
      apiImport="/user/import"
      apiDeleteOne="/user/remove"
      keyProps="id"
      addEditComponent={<AddEditOwnerAccount />}
      scroll={{ x: 2000 }}
    />
  );
}
