import { useRef, useState } from 'react';
import { useGetMessageDetail } from '../../socialNetworkService';
import DateTimeFormat from '../../../../../components/shared/element/DateTimeFormat';
import AdminTable from '../../../../../components/shared/antd/Table/Table';
import MessageTypeContainer from './message-type/MessageTypeContainer';
import environment from '../../../../../constants/environment/environment.dev';
import Hint from '../../../../../components/shared/element/Hint';
import LoadingWrapper from '../../../../../components/shared/antd/LoadingWrapper';
import BasicAvatar from '../../../../../components/shared/antd/BasicAvatar';

export default function MessageManagePage(props) {
  const { pageId, socialPage } = props;

  const [msgSelected, setMsgSelected] = useState(null);
  const getDetail = useRef(false);
  const { data, isFetching } = useGetMessageDetail(
    msgSelected?.id,
    getDetail.current
  );
  getDetail.current = false;

  const columns = [
    {
      title: 'Social Type',
      dataIndex: 'sender.type',
    },
    {
      title: 'Senders Name',
      dataIndex: 'sender.fullName',
    },
    {
      title: 'Senders Avatar',
      dataIndex: 'sender.avatarUrl',
      render: (text, record) => {
        return (
          <BasicAvatar src={text} name={record['sender.fullName']} />
        );
      },
    },
    {
      title: 'Message',
      dataIndex: 'message',
      onCell: (record, _) => {
        return {
          onClick: () => {
            setMsgSelected(record);
            getDetail.current = true;
          },
        };
      },
      render: (record) => {
        return (
          <div className="pointer">
            <b>{record}</b>
          </div>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: 'Date Sent',
      dataIndex: 'createdAt',
      width: 200,
      render: (record) => {
        return <DateTimeFormat dateTime={record} />;
      },
      onCell: () => ({
        className: 'text-center',
      }),
      filter: {
        filterType: 'DateTime',
      },
    },
  ];

  const permission = {
    table: 'table-user',
  };

  return (
    <>
      <Hint
        type="info"
        message={
          <span className="message-detail-hint flex-center">
            We will only get messages from the date you register your
            social media business to our system.
          </span>
        }
      />
      <div className="message-container flex-center">
        <div className="message-table">
          <AdminTable
            apiGetData={`${environment.socialMessage}/${pageId}`}
            columns={columns}
            permission={permission}
            disableSelect
          />
        </div>
        <div className="message-detail flex-center">
          {msgSelected ? (
            <LoadingWrapper
              loading={isFetching}
              className="message-type-loader"
            >
              <MessageTypeContainer
                messageDetail={data}
                type={msgSelected?.type}
                socialPage={socialPage}
              />
            </LoadingWrapper>
          ) : (
            <div className="full-height flex-center">
              <Hint
                message={
                  <span className="message-detail-hint flex-center">
                    You can select the message (the first column with
                    a bold text) from the table to view full details
                  </span>
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
