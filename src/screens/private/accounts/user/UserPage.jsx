import { useRef } from 'react';
import { useQueryClient } from 'react-query';
import { useGetSocialGroups } from '../../../../screens/private/social-network/socialNetworkService';
import { role } from '../../../../constants/environment/environment.dev';
import { RoleChip } from '../../../../components/shared/element/Chip';
import useEffectOnce from '../../../../components/hooks/useEffectOnce';
import environment from '../../../../constants/environment/environment.dev';
import AdminTable from '../../../../components/shared/antd/Table/Table';
import BooleanRow from '../../../../components/shared/element/BooleanRow';
import DateTimeFormat from '../../../../components/shared/element/DateTimeFormat';
import AssignButton from '../../../../components/shared/element/Button/AssignButton';
import ElementWithPermission from '../../../../components/shared/element/ElementWithPermission';
import AddEditAdminAccount from './AddEditUser';
import { defaultAction } from '../../../../constants/table/action';

export default function UserManagement(props) {
  const { defaultFilter = [] } = props;
  const firstRender = useRef(true);
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData('userData');
  const { data } = useGetSocialGroups(firstRender.current);
  firstRender.current = false;

  let apiGetData = environment.user;
  if (userData?.role === 'OWNER') {
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
    ...(userData?.role === 'OWNER' && { import: 'import-user' }),
    export: 'export-user',
    edit: 'update-user',
    delete: 'remove-user',
  };

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
      roleName: 'MANAGER',
    },
    {
      email: 'user3@gmail.com',
      password: 'secret-password',
      roleName: 'SUPPORTER',
    },
    {
      email: 'user4@gmail.com',
      password: 'secret-password',
      roleName: 'SUPPORTER',
    },
    {
      email: 'user5@gmail.com',
      password: 'secret-password',
      roleName: 'MANAGER',
    },
  ];

  const customToolbar = (
    <>
      {userData?.role === 'OWNER' && (
        <ElementWithPermission permission="assign-user">
          <AssignButton />
        </ElementWithPermission>
      )}
    </>
  );

  return (
    <AdminTable
      apiGetData={apiGetData}
      apiImport={`${environment.user}/import`}
      apiExport={`${environment.user}/export`}
      apiDeleteOne={`${environment.user}/remove`}
      keyProps="id"
      columns={columns}
      importColumns={importColumns}
      dumpImportData={dumpImportData}
      addEditComponent={<AddEditAdminAccount />}
      permission={permission}
      defaultFilter={defaultFilter}
      customToolbar={customToolbar}
      actionList={[...defaultAction]}
      scroll={{ x: 2000 }}
    />
  );
}
