import React from 'react';
import { Space, Drawer } from 'antd';
import SaveButton from '../../../element/Button/SaveButton';
import CancelButton from '../../../element/Button/CancelButton';

export default function AddEditWrapper(props) {
  const {
    open,
    onClose,
    actionType,
    record,
    ...other
  } = props;

  function closeDrawer() {
    onClose();
  }

  function handleConfirm() {
    // cb();
    console.log('a')
  }

  return (
    <Drawer
      maskClosable={false}
      destroyOnClose
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
        handleSubmit: handleConfirm
      })}
    </Drawer>
  );
}
