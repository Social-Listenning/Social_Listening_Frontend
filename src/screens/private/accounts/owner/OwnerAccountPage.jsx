import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import AddEditOwnerAccount from './AddEditOwnerAccount';

export default function OwnerAccountManagement() {
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
    },
    {
      title: 'Email',
      dataIndex: 'email',
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

  const importColumns = columns.filter(
    (col) => col?.title !== 'Active'
  );

  return (
    <AdminTable
      apiGetData="/user/all"
      columns={columns}
      importColumns={importColumns}
      apiImport="/user/import"
      addEditComponent={<AddEditOwnerAccount />}
    />
  );
}
