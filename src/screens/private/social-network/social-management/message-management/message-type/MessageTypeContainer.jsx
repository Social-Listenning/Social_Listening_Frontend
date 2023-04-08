import { useRef } from 'react';
import { Tag, Input } from 'antd';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';
import useToggle from '../../../../../../components/hooks/useToggle';
import useUpdateEffect from '../../../../../../components/hooks/useUpdateEffect';
import BasicAvatar from '../../../../../../components/shared/antd/BasicAvatar';
import IconButton from '../../../../../../components/shared/element/Button/IconButton';
import IconMoreButton from '../../../../../../components/shared/element/Button/IconMoreButton';
import ClassicDropdown from '../../../../../../components/shared/antd/Dropdown/Classic';
import PostHeader from './PostHeader';
import ChatHeader from './ChatHeader';

export default function PostType(props) {
  const messageContainer = useRef(null);
  const [showRecommend, toggleShowRecommend] = useToggle(false);

  useUpdateEffect(() => {
    if (showRecommend && messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  }, [showRecommend]);

  let messageContainerHeight = ['24rem', '39rem'];

  const mockData = {
    post: {
      id: 'c20fea98-5276-4b92-8116-5bf744b21a27',
      postId: 'DucKhongNgu',
      message: 'Testing Post',
      permalinkUrl: 'https://www.facebook.com',
      createdAt: '2023-04-03T00:00:00.000Z',
    },
    message: [
      {
        id: 'bd8b0ff5-c7ff-43db-9e3f-762760d58c4b',
        message: 'Test message',
        createdAt: '2023-04-03T00:00:00.000Z',
        type: 'Comment',
        messageId: 'commentId',
      },
      {
        id: '70d63338-361a-4c10-a42b-19f50af7db9c',
        message: 'Test message',
        createdAt: '2023-04-03T00:00:00.000Z',
        type: 'Comment',
        messageId: 'replyId',
      },
      {
        id: '70d63338-361a-4c10-a42b-19f50af7db9c',
        message: 'Test message',
        createdAt: '2023-04-03T00:00:00.000Z',
        type: 'Bot',
        messageId: 'replyId',
      },
      {
        id: '70d63338-361a-4c10-a42b-19f50af7db9c',
        message: 'Test message',
        createdAt: '2023-04-03T00:00:00.000Z',
        type: 'Comment',
        messageId: 'replyId',
      },
    ],
  };

  return (
    <>
      {/* <PostHeader /> */}
      <ChatHeader />
      <div className="message-section">
        <div
          ref={messageContainer}
          className="message-container"
          style={{ height: showRecommend ? '31rem' : '46rem' }}
        >
          {Array(12)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className={`${
                  index % 2 !== 0 ? 'page-respond ' : ''
                }message-item`}
              >
                <BasicAvatar />
                <Tag
                  color={index % 2 !== 0 && 'var(--primary-color)'}
                  className="message-chip-container"
                >
                  <div className="message-chip-user flex-center">
                    <b>Thắng BCN</b>
                    <span className="message-date">2023/04/07</span>
                  </div>
                  <span className="message-chip limit-line">
                    velit aliquet sagittis id consectetur purus ut
                    faucibus pulvinar elementum integer enim neque
                    volutpat ac tincidunt vitae semper quis lectus
                    nulla at volutpat diam ut venenatis tellus in
                    metus vulputate eu scelerisque felis imperdiet
                  </span>
                </Tag>
                <ClassicDropdown
                  clickTrigger
                  list={['Edit', 'Reply', 'Delete']}
                >
                  <IconMoreButton />
                </ClassicDropdown>
              </div>
            ))}
        </div>
      </div>
      <div className="respond-section">
        {showRecommend && (
          <div className="recommend-response-container">
            {Array(4)
              .fill()
              .map((_, index) => (
                <Tag key={index} className="recommend-response-chip">
                  <span className="recommend-response limit-line">
                    velit aliquet sagittis id consectetur purus ut
                    faucibus pulvinar elementum integer enim neque
                    volutpat ac tincidunt vitae semper quis lectus
                    nulla at volutpat diam ut venenatis tellus in
                    metus vulputate eu scelerisque felis imperdiet
                  </span>
                </Tag>
              ))}
            <IconButton
              className="recommend-close-icon"
              tooltip="Click to close recommend"
              icon={<CloseOutlined />}
              onClick={() => {
                toggleShowRecommend(false);
              }}
            />
          </div>
        )}
        <div className="respose-input-container flex-center">
          <Input.TextArea
            allowClear
            autoSize={{ minRows: 5, maxRows: 5 }}
            onFocus={() => {
              toggleShowRecommend(true);
            }}
            onBlur={() => {
              // toggleShowRecommend(false);
            }}
          />
          <IconButton
            icon={<SendOutlined className="respond-icon" />}
            type="link"
          />
        </div>
      </div>
    </>
  );
}
