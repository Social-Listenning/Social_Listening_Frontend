import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import AddEditOwnerAccount from './AddEditOwnerAccount';

export default function OwnerAccountManagement() {
  const columns = [
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (record) => {
        return <BooleanRow active={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
      sort: false,
      resizeable: false,
      width: 80,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      required: true,
    },
    {
      title: 'Role',
      dataIndex: 'role.RoleName',
      required: true,
      sort: false,
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
      dataIndex: 'role',
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
      apiDeleteOne="/remove"
      keyProps="id"
      addEditComponent={<AddEditOwnerAccount />}
    />
  );
}
