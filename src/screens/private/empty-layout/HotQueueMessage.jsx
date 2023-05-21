import { useRef, useState } from 'react';
import { Layout, Divider, Input } from 'antd';
import { SendOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useGetConversationWithUserId } from '../social-network/socialNetworkService';
import useEffectOnce from '../../../components/hooks/useEffectOnce';
import SearchBar from '../../../components/shared/antd/AutoComplete/SearchBar';
import BasicAvatar from '../../../components/shared/antd/BasicAvatar';
import IconButton from '../../../components/shared/element/Button/IconButton';
import Title from '../../../components/shared/element/Title';
import MessageManagePage from '../social-network/social-management/message-management/MessageManagePage';
import Hint from '../../../components/shared/element/Hint';
import './emptyLayout.scss';
import '../social-network/socialNetwork.scss';

const { Header, Sider, Content } = Layout;
export default function HotQueueMessage() {
  const messageContainer = useRef(null);
  const [socketData, setSocketData] = useState(null);
  const [userSupportedList, setUserSupportedList] = useState([]);

  const receiveDataFromParent = (payload) => {
    if (payload.data) {
      if (payload.data.messageSupport) {
        setUserSupportedList((old) => [
          ...old.filter(
            (item) => !item.includes(payload.data.messageSupport)
          ),
          `Agent#${payload.data.messageSupport}`,
        ]);
      } else {
        setSocketData(payload.data);
      }
    }
  };

  useEffectOnce(
    () => {
      if (messageContainer.current) {
        setTimeout(() => {
          messageContainer.current.scrollTop =
            messageContainer.current.scrollHeight;
        }, 50);
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
    () => {
      window.removeEventListener(
        'message',
        receiveDataFromParent,
        false
      );
    }
  );

  const mock = [
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: true,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: true,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: true,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: true,
    },
    {
      text: 'Lorem ipsum dolor sit amet, consecteturadipiscing elit. Quisque vel tempor ligula.Donec at interdum nibh. Suspendisse porta massa quis ligula blandit, et pulvinar arcu blandit.',
      isSent: false,
    },
  ];

  let hotQueueMessage;
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
          {Array(20)
            .fill()
            .map((item, index) => (
              <li
                key={index}
                className="hotqueue-block-container pointer"
              >
                {/* <InfoCircleOutlined className='lo4'/> */}
                <BasicAvatar />
                <div className="hotqueue-block">
                  <b className="hotqueue-user-name limit-line">Đức</b>
                  <div className="last-message">
                    <span className="limit-line">
                      Lorem ipsum dolor sit amet, consectetur
                      adipiscing elit. Quisque vel tempor ligula.
                      Donec at interdum nibh. Suspendisse porta massa
                      quis ligula blandit, et pulvinar arcu blandit.
                      In hac habitasse platea dictumst. Praesent
                      faucibus nisi at metus euismod accumsan id vitae
                      metus. Praesent placerat mi eget mollis
                      tincidunt. Integer pulvinar nunc nibh, ut
                      finibus arcu suscipit ac. Quisque volutpat
                      feugiat arcu, vel bibendum libero pharetra quis.
                    </span>
                    <span>&#183;</span>
                    <span>28/4/2023</span>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </Sider>
      <Layout className="full-height-screen">
        {/* <Header className="hotqueue-header">
          <b className="full-height flex-center name">Đức BCN</b> */}
        {/* <div className="header-utils full-height flex-center">
            <IconButton icon={<ReloadOutlined />} />
            <IconButton icon={<CloseOutlined />} />
          </div> */}
        {/* </Header> */}
        <Content className="social-tab hotqueue-content">
          {socketData?.notifyAgentMessage && (
            <Hint message={hotQueueMessage} type="info" />
          )}
          {socketData?.messageType && (
            <>
              {socketData?.messageType === 'Message' ? (
                <>
                  <div
                    ref={messageContainer}
                    className="hotqueue-conservation"
                  >
                    {mock.map((item, index) => {
                      let isFinal = false;
                      if (
                        mock[index]?.isSent !==
                        mock[index + 1]?.isSent
                      ) {
                        isFinal = true;
                      }
                      let isFirst = false;
                      if (
                        mock[index]?.isSent !==
                        mock[index - 1]?.isSent
                      ) {
                        isFirst = true;
                      }

                      return (
                        <div
                          key={index}
                          className="conservation-container"
                          style={{
                            justifyContent: item.isSent
                              ? 'flex-end'
                              : 'flex-start',
                          }}
                        >
                          {!item.isSent && isFinal && <BasicAvatar />}
                          <div
                            className="conservation-block"
                            style={{
                              alignItems: item.isSent
                                ? 'flex-end'
                                : 'flex-start',
                              marginLeft: !isFinal ? '4rem' : '0',
                            }}
                          >
                            <span
                              style={{
                                marginLeft: item.isSent
                                  ? 'auto'
                                  : '0',
                                display: !isFirst ? 'none' : 'block',
                              }}
                            >
                              28/4 04:35 PM
                            </span>
                            <div
                              className="conservation-text"
                              style={{
                                backgroundColor: item.isSent
                                  ? 'var(--primary-color)'
                                  : '#dedede',
                                color: item.isSent ? '#fff' : '#000',
                              }}
                            >
                              {item.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="hotqueue-footer">
                    <Input allowClear className="hotqueue-respond" />
                    <IconButton icon={<SendOutlined />} />
                  </div>
                </>
              ) : (
                <MessageManagePage
                  pageId={socketData?.tabId}
                  socialPage={socketData?.socialPage}
                  type={socketData?.messageType}
                  messageData={{
                    id: socketData?.messageId,
                    type: socketData?.messageType,
                  }}
                  showTable={false}
                  showHint={false}
                  getMessageDetail={true}
                  userSupportedList={userSupportedList}
                />
              )}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
