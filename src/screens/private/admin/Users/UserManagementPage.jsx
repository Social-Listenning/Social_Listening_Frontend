import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import AddEditUser from './AddEditUser';

export default function UserManagement() {
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (record) => {
        return <BooleanRow active={record} />;
      },
      onCell: (record, _) => ({
        style: {
          textAlign: 'center',
        },
      }),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
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

  return (
    <AdminTable
      columns={columns}
      apiGetData="/user"
      addEditComponent={<AddEditUser />}
    />
  );
}
