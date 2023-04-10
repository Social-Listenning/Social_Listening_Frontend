import { Badge } from 'antd';
import BasicAvatar from '../../../../../../components/shared/antd/BasicAvatar';
import ClassicDropdown from '../../../../../../components/shared/antd/Dropdown/Classic';
import IconMoreButton from '../../../../../../components/shared/element/Button/IconMoreButton';

export default function ChatHeader({ userData }) {
  return (
    <div className="post-section flex-center">
      <div className="post-header flex-center">
        <div className="post-info flex-center">
          <div className="post-avt-holder">
            {userData?.isActive && (
              <Badge status="success" className="post-avt-status" />
            )}
            <BasicAvatar size={40} />
          </div>
          <div className="post-user-date flex-center">
            <b className="post-user">{userData?.name}</b>
            <span className="message-date">Active now</span>
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
