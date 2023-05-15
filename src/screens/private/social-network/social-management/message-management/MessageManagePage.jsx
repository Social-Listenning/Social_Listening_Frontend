import { useRef, useState } from 'react';
import {
  useGetAllConversation,
  useGetConversationWithUserId,
  useGetMessageDetail,
} from '../../socialNetworkService';
import DateTimeFormat from '../../../../../components/shared/element/DateTimeFormat';
import AdminTable from '../../../../../components/shared/antd/Table/Table';
import MessageTypeContainer from './message-type/MessageTypeContainer';
import environment from '../../../../../constants/environment/environment.dev';
import Hint from '../../../../../components/shared/element/Hint';
import LoadingWrapper from '../../../../../components/shared/antd/LoadingWrapper';
import BasicAvatar from '../../../../../components/shared/antd/BasicAvatar';
import ToolTipWrapper from '../../../../../components/shared/antd/ToolTipWrapper';
import useEffectOnce from '../../../../../components/hooks/useEffectOnce';

export default function MessageManagePage(props) {
  const { pageId, socialPage, type } = props;

  const getAllConversation = useRef(true);
  const [_, forceUpdate] = useState(null);
  const {
    data: allConversation,
    isFetching: allConversationFetching,
  } = useGetAllConversation(
    pageId,
    type === 'message' && getAllConversation.current
  );
  getAllConversation.current = false;
  useEffectOnce(() => {
    document
      .getElementById('refresh-table')
      ?.addEventListener('click', (e) => {
        getAllConversation.current = true;
        forceUpdate(e);
      });
  });

  const [msgSelected, setMsgSelected] = useState(null);
  const getDetail = useRef(false);
  const { data: commentDetail, isFetching: isCommentFetching } =
    useGetMessageDetail(
      msgSelected?.id,
      getDetail.current && type === 'comment'
    );
  const { data: messageDetail, isFetching: isMessageFetching } =
    useGetConversationWithUserId(
      {
        pageId: pageId,
        userId: msgSelected?.sender?.id,
        body: {
          orders: [],
          filter: [],
          size: 10000,
          pageNumber: 1,
          totalElement: 0,
          // offset: 0
        },
      },
      getDetail.current && type === 'message'
    );
  getDetail.current = false;

  const columns = [
    {
      title: 'Sender',
      dataIndex: 'sender.fullName',
      render: (text, record) => {
        return (
          <div className="sender-header flex-center">
            <BasicAvatar
              src={record?.sender?.avatarUrl}
              name={record['sender.fullName']}
            />
            <span className="sender-name limit-line">
              {record['sender.fullName']}
            </span>
          </div>
        );
      },
      fixed: true,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      onCell: (record, _) => {
        return {
          onClick: () => {
            getDetail.current = true;
            setMsgSelected({ ...record });
          },
        };
      },
      render: (record) => {
        return (
          <ToolTipWrapper tooltip="Click to view full details">
            <div className="pointer limit-line">
              <b>
                {record?.from !== record?.sender?.id && 'Bot: '}
                {record}
              </b>
            </div>
          </ToolTipWrapper>
        );
      },
    },
    {
      title: 'Date Sent',
      dataIndex: type === 'message' ? 'lastSent' : 'createdAt',
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
            apiGetData={
              type === 'comment'
                ? `${environment.socialMessage}/${pageId}`
                : null
            }
            columns={columns}
            permission={permission}
            showToolbar={false}
            disableSelect
            {...(type === 'message' && {
              tableData: allConversation,
              isLoading: allConversationFetching,
            })}
            scroll={{
              x: 1000,
            }}
          />
        </div>
        <div className="message-detail flex-center">
          {msgSelected ? (
            <LoadingWrapper
              className="message-type-loader"
              loading={
                type === 'comment'
                  ? isCommentFetching
                  : isMessageFetching
              }
            >
              <MessageTypeContainer
                messageSelected={msgSelected}
                type={msgSelected?.type ?? 'Message'}
                socialPage={socialPage}
                messageDetail={
                  type === 'comment'
                    ? commentDetail
                    : messageDetail?.data?.reverse()
                }
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
