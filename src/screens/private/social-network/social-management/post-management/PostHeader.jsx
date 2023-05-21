import { Button } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import BasicAvatar from '../../../../../components/shared/antd/BasicAvatar';

export default function PostHeader({
  hotQueueData,
  pageData,
  postData,
  showStop,
}) {
  const dateSent = new Date(postData?.createdAt)?.toLocaleString();
  return (
    <div className="post-header-container flex-center">
      <div className="post-header flex-center">
        <div className="post-info flex-center">
          <BasicAvatar
            size={40}
            name={pageData?.name}
            src={pageData?.pictureUrl}
          />
          <div className="post-user-date flex-center">
            <b className="post-user">{pageData?.name}</b>
            <span className="message-date">{dateSent}</span>
          </div>
        </div>
        {showStop && (
          <Button
            type="primary"
            danger
            icon={<PoweroffOutlined />}
            onClick={() => {
              window.parent.postMessage(hotQueueData, '*');
            }}
          >
            Stop supporting
          </Button>
        )}
      </div>
      <div className="post-detail">
        <span className="limit-line">{postData?.message}</span>
      </div>
    </div>
  );
}
