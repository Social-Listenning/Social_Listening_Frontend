import { Drawer } from 'antd';

export default function AddEditWrapper(props) {
  const { open, toggleOpen, handleConfirm } = props;
 
  return (
    <Drawer
      maskClosable={false}
      onClose={toggleOpen(false)}
      open={open}
    >
      {props.children}
    </Drawer>
  );
}
