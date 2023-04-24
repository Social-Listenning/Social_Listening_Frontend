import { Form, Input } from 'antd';
import AddEditWrapper from '../../../../../../components/shared/antd/Table/Drawer/AddEditWrapper';

export default function AddEditBotFlow(props) {
  const { open, onClose, selectedData, action } = props;

  const [addEditWorkflowForm] = Form.useForm();

  async function handleSubmit(value) {
    if (action === 'Add') {
    } else if (action === 'Edit') {
    }
  }

  function closeDrawer() {
    onClose();
    addEditWorkflowForm.resetFields();
  }

  return (
    <AddEditWrapper
      open={open}
      onClose={closeDrawer}
      form={addEditWorkflowForm}
    >
      <Form
        form={addEditWorkflowForm}
        name="add-edit-workflow-form"
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Name is required',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </AddEditWrapper>
  );
}
