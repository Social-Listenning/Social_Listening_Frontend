import { Dropdown } from 'antd';
import { Checker } from '../../../../utils/dataChecker';

export default function ClassicDropdown(props) {
  const {
    list,
    selectedKeys = [],
    clickTrigger = false,
    noneOption = false,
    handleItemClick,
    ...other
  } = props;

  let items =
    list?.map((item, index) => {
      return {
        label: item,
        key: index,
      };
    }) ?? [];

  const none = [{ label: 'None', key: -1 }];

  if (noneOption) {
    items = none.concat(items);
  }

  function handleMenuClick(e) {
    if (!Checker.isNullOrEmpty(handleItemClick)) {
      handleItemClick(e);
    }
  }

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
        selectedKeys: selectedKeys,
      }}
      {...(clickTrigger && { trigger: ['click'] })}
      {...other}
    >
      {props.children}
    </Dropdown>
  );
}
