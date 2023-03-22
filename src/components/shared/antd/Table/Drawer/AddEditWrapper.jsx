import React from 'react';
import { Space, Drawer } from 'antd';
import SaveButton from '../../../element/Button/SaveButton';
import CancelButton from '../../../element/Button/CancelButton';

export default function AddEditWrapper(props) {
  const { open, onClose, form, ...other } = props;

  function closeDrawer() {
    onClose();
  }

  async function handleConfirm() {
    await form.submit();
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
      {props.children}
    </Drawer>
  );
}
