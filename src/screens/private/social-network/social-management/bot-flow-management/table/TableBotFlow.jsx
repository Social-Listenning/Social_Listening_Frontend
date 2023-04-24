import React from 'react';
import AdminTable from '../../../../../../components/shared/antd/Table/Table';
import environment from '../../../../../../constants/environment/environment.dev';
import BooleanRow from '../../../../../../components/shared/element/BooleanRow';
import DateTimeFormat from '../../../../../../components/shared/element/DateTimeFormat';
import AddEditBotFlow from './AddEditBotFlow';

export default function TableBotFlow({ setFlowDetail }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      required: true,
      fixed: true,
      render: (record, value) => {
        return (
          <b
            className="pointer"
            onClick={() => {
              setFlowDetail(value);
            }}
          >
            {record}
          </b>
        );
      },
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
      title: 'Date Created',
      dataIndex: 'createdAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
      width: 100,
    },
    {
      title: 'Date Modified',
      dataIndex: 'updatedAt',
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
      width: 100,
    },
  ];

  const permission = {
    table: 'table-user',
    new: 'create-user',
  };

  return (
    <AdminTable
      disableSelect
      // apiGetData={`${environment.workflow}/get`}
      columns={columns}
      permission={permission}
      addEditComponent={<AddEditBotFlow />}
      tableData={[
        {
          key: '1',
          name: 'template',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          key: '2',
          name: 'template1',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          key: '3',
          name: 'template2',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]}
    />
  );
}
