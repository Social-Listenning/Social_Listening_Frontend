import BasicAvatar from '../../../../../../components/shared/antd/BasicAvatar';
import IconMoreButton from '../../../../../../components/shared/element/Button/IconMoreButton';
import ClassicDropdown from '../../../../../../components/shared/antd/Dropdown/Classic';

export default function PostHeader({ pageData, postData }) {
  return (
    <div className="post-section flex-center">
      <div className="post-header flex-center">
        <div className="post-info flex-center">
          <BasicAvatar
            size={40}
            name={pageData?.name}
            src={pageData?.pictureUrl}
          />
          <div className="post-user-date flex-center">
            <b className="post-user">{pageData?.name}</b>
            <span className="message-date">
              {postData?.createdAt}
            </span>
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
      <div className="post-detail limit-line">
        {postData?.message}
      </div>
    </div>
  );
}
