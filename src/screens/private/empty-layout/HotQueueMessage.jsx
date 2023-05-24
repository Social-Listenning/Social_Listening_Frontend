import { useRef, useState } from 'react';
import { Layout, Divider, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useGetHotqueueConversation } from './hotQueueService';
import {
  useGetConversationWithUserId,
  useGetSocialGroups,
} from '../social-network/socialNetworkService';
import useUpdateEffect from '../../../components/hooks/useUpdateEffect';
import useEffectOnce from '../../../components/hooks/useEffectOnce';
import SearchBar from '../../../components/shared/antd/AutoComplete/SearchBar';
import BasicAvatar from '../../../components/shared/antd/BasicAvatar';
import IconButton from '../../../components/shared/element/Button/IconButton';
import Title from '../../../components/shared/element/Title';
import MessageManagePage from '../social-network/social-management/message-management/MessageManagePage';
import Hint from '../../../components/shared/element/Hint';
import LoadingWrapper from '../../../components/shared/antd/LoadingWrapper';
import './emptyLayout.scss';
import '../social-network/socialNetwork.scss';

const { Header, Sider, Content } = Layout;
export default function HotQueueMessage() {
  const messageContainer = useRef(null);
  const [socketData, setSocketData] = useState(null);
  const [userSupportedList, setUserSupportedList] = useState([]);

  const canGetSocialGroups = useRef(true);
  const { data: socialGroups } = useGetSocialGroups(
    canGetSocialGroups.current
  );
  canGetSocialGroups.current = false;

  const getConversation = useRef(true);
  const { data: conversationList, isFetching: conversationFetching } =
    useGetHotqueueConversation(getConversation.current);
  getConversation.current = false;

  const stopSupporting = useRef(false);
  const receiveDataFromParent = (payload) => {
    if (payload.data) {
      if (payload.data.messageSupport) {
        setUserSupportedList((old) => [
          ...old.filter(
            (item) => !item.includes(payload.data.messageSupport)
          ),
          `Agent#${payload.data.messageSupport}`,
        ]);
      } else if (
        payload.data.commentCome ||
        payload.data.messageCome
      ) {
        if (
          conversationList?.find(
            (item) =>
              item?.sender?.senderId ===
                payload.data.commentCome.senderId ||
              item?.tabId === payload.data.commentCome.tabId ||
              item?.type === payload.data.commentCome.type
          )
        ) {
          getConversation.current = true;
          setSocketData({ ...socketData });
        }
      } else if (payload.data.stopSupporting) {
        stopSupporting.current = true;
        getConversation.current = true;
        setSocketData(null);
      } else {
        setSocketData(payload.data);
      }
    }
  };

  useEffectOnce(() => {
    if (messageContainer.current) {
      setTimeout(() => {
        messageContainer.current.scrollTop =
          messageContainer.current.scrollHeight;
      }, 50);
    }
  });

  useUpdateEffect(
    () => {
      if (stopSupporting.current && !conversationList?.length) {
        window.parent.postMessage(
          {
            closed: true,
          },
          '*'
        );
      }

      window.parent.postMessage(
        {
          rendered: true,
        },
        '*'
      );

      window.addEventListener(
        'message',
        receiveDataFromParent,
        false
      );
    },
    [conversationList],
    () => {
      window.removeEventListener('message', receiveDataFromParent);
    }
  );

  let hotQueueMessage =
    'This message is notified by your bot not found intents';
  if (socketData?.notifyAgentMessage) {
    switch (socketData.notifyAgentMessage) {
      case 'Workflow':
        hotQueueMessage = 'This message is notified by your workflow';
        break;
      case 'Sentiment':
        hotQueueMessage =
          'This message is notified by too many sentiments';
        break;
      case 'Intent':
        hotQueueMessage =
          'This message is notified by your bot not found intents';
        break;
      default:
        break;
    }
  }

  return (
    <Layout className="hotqueue-layout">
      <Sider width={400}>
        <Title>Hotqueue Message</Title>
        <SearchBar className="search-user" />
        <Divider />
        <ul className="hotqueue-list">
          <LoadingWrapper loading={conversationFetching}>
            {conversationList?.map((item, index) => {
              const dateSent = new Date(
                item?.lastSent
              )?.toLocaleString();

              return (
                <li
                  key={index}
                  className={`hotqueue-block-container pointer${
                    item?.messageId === socketData?.messageId
                      ? ' selected'
                      : ''
                  }`}
                  onClick={() => {
                    const socialPage = socialGroups.find(
                      (x) => x.id === item.tabId
                    );

                    let pageData = null;
                    if (socialPage?.SocialNetwork?.extendData) {
                      pageData = JSON.parse(
                        socialPage?.SocialNetwork?.extendData
                      );
                    }

                    setSocketData((old) => {
                      return {
                        ...old,
                        messageId: item?.messageId,
                        messageType: item?.type,
                        tabId: item?.tabId,
                        socialPage: pageData,
                        sender: item?.sender,
                      };
                    });
                  }}
                >
                  <BasicAvatar
                    name={item?.sender?.fullName}
                    src={item?.sender?.avatarUrl}
                  />
                  <div className="hotqueue-block">
                    <b className="hotqueue-user-name limit-line">
                      {item?.sender?.fullName}
                    </b>
                    <div className="last-message">
                      <span className="limit-line">
                        {item?.message}
                      </span>
                      <span>&#183;</span>
                      <span className="last-date-sent">
                        {dateSent}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </LoadingWrapper>
        </ul>
      </Sider>
      <Layout className="full-height-screen">
        <Content className="social-tab hotqueue-content">
          {socketData?.messageType && (
            <Hint message={hotQueueMessage} type="info" />
          )}
          {socketData?.messageType && (
            <MessageManagePage
              pageId={socketData?.tabId}
              socialPage={socketData?.socialPage}
              type={socketData?.messageType}
              messageData={{
                id: socketData?.messageId,
                type: socketData?.messageType,
                sender: socketData?.sender,
              }}
              showTable={false}
              showHint={false}
              getMessageDetail={true}
              userSupportedList={userSupportedList}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
