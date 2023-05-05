import { useState } from 'react';
import { Form, Input, Switch } from 'antd';
import { useMutation } from 'react-query';
import { notifyService } from '../../../../../services/notifyService';
import useEffectOnce from '../../../../../components/hooks/useEffectOnce';
import AddEditWrapper from '../../../../../components/shared/antd/Table/Drawer/AddEditWrapper';

export default function AddEditIntent(props) {
  const { open, onClose, selectedData, action, agentId } = props;

  const [addEditIntentForm] = Form.useForm();
  const [fallBack, setFallBack] = useState(selectedData?.is_fallback);

  useEffectOnce(() => {
    addEditIntentForm.setFieldsValue({
      name: selectedData?.display_name,
      priority: selectedData?.priority,
    });
  });

  function handleSubmit(value) {
    if (action === 'Add') {
    } else if (action === 'Edit') {
      let id = null;
      if (selectedData) {
        const splitName = selectedData?.name?.split('/');
        id = splitName[splitName?.length - 1];
      }
    }
  }

  function closeDrawer() {
    onClose();
    addEditIntentForm.resetFields();
  }

  return (
    <AddEditWrapper
      open={open}
      onClose={closeDrawer}
      form={addEditIntentForm}
      loading={false}
    >
      <Form
        form={addEditIntentForm}
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

        <Form.Item label="Priority" name="priority">
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Fallback" name="isFallback">
          <Switch
            checked={fallBack}
            onChange={(change) => {
              setFallBack(change);
            }}
          />
        </Form.Item>
      </Form>
    </AddEditWrapper>
  );
}
