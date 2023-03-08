import { MoreOutlined } from '@ant-design/icons';
import ClassicDropdown from '../Dropdown/Classic';
import IconButton from '../Button/IconButton';
import { Tooltip } from 'antd';

export default function TableAction(props) {
  const {
    selectAction,
    actionList,
    selectedRecord,
    openAddEdit,
    onClickDelete,
  } = props;

  const formatActionList = actionList?.map((element) => {
    return (
      <>
        {element?.icon}
        <span style={{ marginLeft: '0.6rem' }}>
          {element?.action}
        </span>
      </>
    );
  });

  function handleAction(e) {
    selectAction(actionList[e.key]?.action);
    if (actionList[e.key]?.action === 'Edit') {
      openAddEdit(true);
    } else if (actionList[e.key]?.action === 'Delete') {
      onClickDelete(selectedRecord);
    }
  }

  return (
    <Tooltip title="Actions">
      <div className="flex-center">
        <ClassicDropdown
          clickTrigger
          list={formatActionList}
          handleItemClick={handleAction}
        >
          <IconButton
            icon={<MoreOutlined className="table-action-icon" />}
          />
        </ClassicDropdown>
      </div>
    </Tooltip>
  );
}
