import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import AddEditAdminAccount from './AddEditAdminAccount';

export default function AdminAccountManagement() {
  const columns = [
    // {
    //   title: 'Id',
    //   dataIndex: 'id',
    // },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (record) => {
        return <BooleanRow active={record} />;
      },
      onCell: (record, _) => ({
        className: 'text-center',
      }),
      sort: false,
      width: 60,
      maxWidth: 60,
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

  const importColumns = columns.filter(
    (col) => col?.title !== 'Active'
  );

  return (
    <AdminTable
      apiGetData="/user"
      apiImport="/user/import"
      columns={columns}
      importColumns={importColumns}
      addEditComponent={<AddEditAdminAccount />}
    />
  );
}
