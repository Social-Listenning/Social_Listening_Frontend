import { Form } from 'antd';
import AddEditWrapper from '../../../components/shared/antd/Table/Drawer/AddEditWrapper';

export default function EditSettingPage(props) {
  const { open, onClose, selectedData, action } = props;
  const [editAllSettingForm] = Form.useForm();

  function closeDrawer() {
    onClose();
    editAllSettingForm.resetFields();
  }
  return (
    <AddEditWrapper
      open={open}
      onClose={closeDrawer}
      form={editAllSettingForm}
    >
      <Form>
        <Form.Item>
            
        </Form.Item>
      </Form>
    </AddEditWrapper>
  );
}
