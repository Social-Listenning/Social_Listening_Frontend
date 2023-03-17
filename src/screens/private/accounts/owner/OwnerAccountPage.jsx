import { role } from '../../../../constants/profile/profile';
import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import Chip from '../../../../components/shared/element/Chip';
import AddEditOwnerAccount from './AddEditOwnerAccount';

const roleData = role.slice(1);
export default function OwnerAccountManagement() {
  const columns = [
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
      width: 80,
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
        options: roleData,
      },
      render: (record) => {
        return <Chip>{record}</Chip>;
      },
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
    },
    {
      title: 'Date Modified',
      dataIndex: 'updatedAt',
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
      apiDeleteOne="/remove"
      keyProps="id"
      addEditComponent={<AddEditOwnerAccount />}
      scroll={{ x: 2000 }}
    />
  );
}
