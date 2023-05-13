import React from 'react';
import { RoleChip } from '../../../../../components/shared/element/Chip';
import { role } from '../../../../../constants/environment/environment.dev';
import environment from '../../../../../constants/environment/environment.dev';
import BooleanRow from '../../../../../components/shared/element/BooleanRow';
import DateTimeFormat from '../../../../../components/shared/element/DateTimeFormat';
import AdminTable from '../../../../../components/shared/antd/Table/Table';

export default function MemberManagePage({ pageId, socialPage }) {
  const columns = [
    {
      title: 'Email',
      dataIndex: 'user.email',
      required: true,
      fixed: true,
    },
    {
      title: 'Active',
      dataIndex: 'user.isActive',
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
        options: role?.filter((item) => item.label !== 'Admin'),
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
      dataIndex: 'user.userName',
    },
    {
      title: 'Gender',
      dataIndex: 'user.gender',
    },
    {
      title: 'Full Name',
      dataIndex: 'user.fullName',
    },
    {
      title: 'Phone',
      dataIndex: 'user.phoneNumber',
    },
    {
      title: 'Date Created',
      dataIndex: 'user.createdAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      filter: {
        filterType: 'DateTime',
      },
      onCell: () => ({
        className: 'text-center',
      }),
    },
    {
      title: 'Date Modified',
      dataIndex: 'user.updatedAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      filter: {
        filterType: 'DateTime',
      },
      onCell: () => ({
        className: 'text-center',
      }),
    },
  ];

  const permission = {
    table: 'table-user',
  };

  return (
    <AdminTable
      apiGetData={`${environment.user}/tab/${pageId}`}
      columns={columns}
      permission={permission}
      scroll={{ x: 2000 }}
    />
  );
}
