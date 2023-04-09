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

export default function MessageTypeContainer(props) {
  const { messageDetail, type, socialPage } = props;
  const messageContainer = useRef(null);
  const [showRecommend, toggleShowRecommend] = useToggle(false);

  useUpdateEffect(() => {
    if (showRecommend && messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  }, [showRecommend]);

  let messageContainerHeight = ['24rem', '39rem'];
  if (type === 'chat') {
    messageContainerHeight = ['31rem', '46rem'];
  }

  return (
    <>
      {type === 'comment' ? (
        <PostHeader
          pageData={socialPage}
          postData={messageDetail?.post}
        />
      ) : type === 'chat' ? (
        <ChatHeader userData={messageDetail?.user} />
      ) : (
        <>{/* bot type */}</>
      )}
      <div className="message-section">
        <div
          ref={messageContainer}
          className="message-container"
          style={{
            height: showRecommend
              ? messageContainerHeight[0]
              : messageContainerHeight[1],
          }}
        >
          {messageDetail?.message?.map((item) => (
            <div
              key={item?.id}
              className={`${
                item?.type === 'Bot' ? 'page-respond ' : ''
              }message-item`}
            >
              <BasicAvatar />
              <Tag
                color={item?.type === 'Bot' && 'var(--primary-color)'}
                className="message-chip-container"
              >
                <div className="message-chip-user flex-center">
                  {/* <b>Thắng BCN</b> */}
                  <span className="message-date">
                    {item?.createdAt}
                  </span>
                </div>
                <span className="message-chip limit-line">
                  {item?.message}
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
