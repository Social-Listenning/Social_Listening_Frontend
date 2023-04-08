import { Badge } from 'antd';
import BasicAvatar from '../../../../../../components/shared/antd/BasicAvatar';
import ClassicDropdown from '../../../../../../components/shared/antd/Dropdown/Classic';
import IconMoreButton from '../../../../../../components/shared/element/Button/IconMoreButton';

export default function ChatHeader(props) {
  const { isActive = true } = props;

  return (
    <div className="post-section flex-center">
      <div className="post-header flex-center">
        <div className="post-info flex-center">
          <div style={{ position: 'relative' }}>
            {isActive && (
              <Badge
                status="success"
                style={{
                  position: 'absolute',
                  bottom: '-0.6rem',
                  right: 0,
                  zIndex: 1,
                }}
              />
            )}
            <BasicAvatar size={40} />
          </div>
          <div className="post-user-date flex-center">
            <b className="post-user">Thắng BCN</b>
            <span className="message-date">Active now</span>
          </div>
        </div>
        <ClassicDropdown
          clickTrigger
          className="post-util"
          list={['Edit', 'Delete']}
        >
          <IconMoreButton />
        </ClassicDropdown>
      </div>
    </div>
  );
}
