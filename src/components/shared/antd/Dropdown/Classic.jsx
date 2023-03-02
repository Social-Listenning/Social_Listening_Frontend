import { Dropdown } from 'antd';
import { Checker } from '../../../../utils/dataChecker';

export default function ClassicDropdown(props) {
  const {
    list,
    selectedKeys = [],
    clickTrigger = false,
    handleItemClick,
  } = props;

  let items =
    list?.map((item, index) => {
      return {
        label: item,
        key: index,
      };
    }) ?? [];

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
    >
      {props.children}
    </Dropdown>
  );
}
