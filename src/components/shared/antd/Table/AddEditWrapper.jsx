import React from 'react';
import { Space, Drawer } from 'antd';
import SaveButton from '../Button/SaveButton';
import CancelButton from '../Button/CancelButton';

export default function AddEditWrapper(props) {
  const {
    open,
    toggleOpen,
    actionType,
    record,
    handleConfirm,
    ...other
  } = props;

  function closeDrawer() {
    toggleOpen(false);
  }

  return (
    <Drawer
      maskClosable={false}
      onClose={closeDrawer}
      open={open}
      extra={
        <Space>
          <CancelButton onClick={closeDrawer} />
          <SaveButton onClick={handleConfirm} />
        </Space>
      }
      {...other}
    >
      {React.cloneElement(props.children, {
        data: record,
        action: actionType,
      })}
    </Drawer>
  );
}
