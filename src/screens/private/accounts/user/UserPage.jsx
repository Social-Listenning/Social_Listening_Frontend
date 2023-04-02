import { useGetDecodedToken } from '../../../../routes/private/privateService';
import { role } from '../../../../constants/environment/environment.dev';
import { RoleChip } from '../../../../components/shared/element/Chip';
import environment from '../../../../constants/environment/environment.dev';
import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import DateTimeFormat from '../../../../components/shared/element/DateTimeFormat';
import AddEditAdminAccount from './AddEditUser';

export default function UserManagement(props) {
  const { defaultFilter = [] } = props;
  const { data } = useGetDecodedToken();

  let apiGetData = environment.user;
  if (data?.role === 'OWNER') {
    apiGetData += '/all';
  }

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
    import: 'import-user',
    export: 'export-user',
    edit: 'update-user',
    delete: 'remove-user',
  };

  return (
    <AdminTable
      apiGetData={apiGetData}
      apiExport={`${environment.user}/export`}
      apiDeleteOne={`${environment.user}/remove`}
      keyProps="id"
      columns={columns}
      addEditComponent={<AddEditAdminAccount />}
      scroll={{ x: 2000 }}
      permission={permission}
      defaultFilter={defaultFilter}
    />
  );
}
