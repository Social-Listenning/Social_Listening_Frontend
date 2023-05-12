import React from 'react';
import { RoleChip } from '../../../../../components/shared/element/Chip';
import DateTimeFormat from '../../../../../components/shared/element/DateTimeFormat';
import AdminTable from '../../../../../components/shared/antd/Table/Table';

export default function MemberManagePage({ pageId, socialPage }) {
  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      required: true,
      fixed: true,
    },
    // {
    //   title: 'Active',
    //   dataIndex: 'isActive',
    //   filter: {
    //     filterType: 'Boolean',
    //   },
    //   render: (record) => {
    //     return <BooleanRow active={record} />;
    //   },
    //   onCell: () => ({
    //     className: 'text-center',
    //   }),
    //   sort: false,
    //   resizeable: false,
    //   width: 100,
    // },
    // {
    //   title: 'Role',
    //   dataIndex: 'role.roleName',
    //   sort: false,
    //   filter: {
    //     filterType: 'Dropdown',
    //     options: formatRole,
    //   },
    //   render: (record) => {
    //     return <RoleChip currentRole={record} />;
    //   },
    //   onCell: () => ({
    //     className: 'text-center',
    //   }),
    // },
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
      filter: {
        filterType: 'DateTime',
      },
      onCell: () => ({
        className: 'text-center',
      }),
    },
    {
      title: 'Date Modified',
      dataIndex: 'updatedAt',
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

  return <AdminTable columns={columns} permission={permission} />;
}
