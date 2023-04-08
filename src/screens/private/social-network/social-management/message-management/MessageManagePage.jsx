import { useRef } from 'react';
import DateTimeFormat from '../../../../../components/shared/element/DateTimeFormat';
import AdminTable from '../../../../../components/shared/antd/Table/Table';
import PostType from './message-type/MessageTypeContainer';
import environment from '../../../../../constants/environment/environment.dev';

export default function MessageManagePage(props) {
  const { pageId } = props;
  const messageDetail = useRef(null);

  const columns = [
    {
      title: 'Message',
      dataIndex: 'message',
      onCell: (record, _) => {
        return {
          onClick: () => {
            messageDetail.current = record;
          },
        };
      },
      render: (record) => {
        return <b className="pointer">{record}</b>;
      },
    },
    {
      title: 'Sender',
      dataIndex: 'sender',
      width: 100,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: 'Date Commented',
      dataIndex: 'createdAt',
      width: 200,
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
    },
  ];

  const dataSource = [
    {
      message: 'Hello',
      sender: 'Qbu',
      type: 'comment',
      createdAt: '2023-03-14T19:03:49.480Z',
    },
    {
      message: 'Wazzup',
      sender: 'Thang',
      type: 'comment',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Where am i',
      sender: 'Duy',
      type: 'comment',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
    {
      message: 'Help',
      sender: 'Duy',
      type: 'chat',
      createdAt: '2023-03-16T10:20:20.052Z',
    },
  ]?.map((item, index) => {
    return {
      key: index,
      ...item,
    };
  });

  const permission = {
    table: 'table-user',
  };

  return (
    <div className="message-container flex-center">
      <div className="message-table">
        <AdminTable
          apiGetData={`${environment.socialMessage}/${pageId}`}
          columns={columns}
          permission={permission}
          tableData={dataSource}
          disableSelect
        />
      </div>
      <div className="message-detail">
        <PostType />
      </div>
    </div>
  );
}
