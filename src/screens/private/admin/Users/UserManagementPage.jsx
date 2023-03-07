import React from 'react';
import AdminTable from '../../../../components/shared/antd/Table/Table';

export default function UserManagement() {
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
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

  return <AdminTable columns={columns} apiGetData="/user" />;
}
