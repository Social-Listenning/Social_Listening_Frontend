import { Card, Badge } from 'antd';
import PostHeader from './PostHeader';
import BasicAvatar from '../../../../../components/shared/antd/BasicAvatar';

const { Meta } = Card;
export default function PostCard({ socialPage, postData }) {
  return (
    <Badge
      overflowCount={99}
      count={postData?.totalUnreadComment}
      color="var(--primary-color)"
      className="post-unread-message"
    >
      <Card
        onClick={() => {}}
        className="post-card-container"
        title={
          <PostHeader pageData={socialPage} postData={postData} />
        }
      >
        <div className="total-comment">
          {postData?.totalComment} comment(s)
        </div>
        <Meta
          avatar={<BasicAvatar />}
          title={
            <div className="last-comment-title flex-center">
              <span>User</span>
              <span className="message-date">
                {postData?.lastMessageAt}
              </span>
            </div>
          }
          description={
            <div className="last-comment limit-line">
              {postData?.lastMessage}
            </div>
          }
        />
      </Card>
    </Badge>
  );
}
