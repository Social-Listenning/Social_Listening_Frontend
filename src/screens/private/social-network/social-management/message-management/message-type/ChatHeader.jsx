import { Badge } from 'antd';
import BasicAvatar from '../../../../../../components/shared/antd/BasicAvatar';
import ClassicDropdown from '../../../../../../components/shared/antd/Dropdown/Classic';
import IconMoreButton from '../../../../../../components/shared/element/Button/IconMoreButton';

export default function ChatHeader({ userData }) {
  return (
    <div className="chat-section">
      <div className="chat-header flex-center">
        <div className="chat-info flex-center">
          <div className="chat-avt-holder">
            {userData?.isActive && (
              <Badge status="success" className="chat-avt-status" />
            )}
            <BasicAvatar
              size={40}
              src={userData?.avatarUrl}
              name={userData?.fullName}
            />
          </div>
          <div className="chat-user-date flex-center">
            <b className="chat-user">{userData?.fullName}</b>
            {/* <span className="message-date">Active now</span> */}
          </div>
        </div>
        {/* <ClassicDropdown
          clickTrigger
          className="post-util"
          list={['Edit', 'Delete']}
        >
          <IconMoreButton />
        </ClassicDropdown> */}
      </div>
    </div>
  );
}
