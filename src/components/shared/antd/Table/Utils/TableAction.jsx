import { MoreOutlined } from '@ant-design/icons';
import { Checker } from '../../../../../utils/dataChecker';
import { defaultAction } from '../../../../../constants/table/action';
import ClassicDropdown from '../../Dropdown/Classic';
import IconButton from '../../../element/Button/IconButton';
import ToolTipWrapper from '../../ToolTipWrapper';

export default function TableAction(props) {
  const {
    selectAction,
    actionList,
    selectedRecord,
    openAddEdit,
    onClickDelete,
    handleActionClick,
  } = props;

  function handleAction(e) {
    selectAction(actionList[e.key]?.label);

    if (Checker.isEqualArrays(actionList, defaultAction)) {
      if (actionList[e.key]?.label === 'Edit') {
        openAddEdit();
      } else if (actionList[e.key]?.label === 'Delete') {
        onClickDelete(selectedRecord);
      }
    } else {
      if (!Checker.isNullOrEmpty(handleActionClick)) {
        let reset = false;
        reset = handleActionClick(
          actionList[e.key]?.label,
          selectedRecord
        );
        if (reset) {
          document.getElementById("refresh-table").click();
        }
      }
    }
  }

  return (
    <ToolTipWrapper tooltip="Click to open actions">
      <div className="flex-center">
        <ClassicDropdown
          clickTrigger
          list={actionList}
          handleItemClick={handleAction}
          hasIcon
        >
          <IconButton
            icon={<MoreOutlined className="table-action-icon" />}
          />
        </ClassicDropdown>
      </div>
    </ToolTipWrapper>
  );
}
