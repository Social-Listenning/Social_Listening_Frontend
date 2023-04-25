import { Form, Input } from 'antd';
import { useMutation } from 'react-query';
import { createBotFlow } from '../../../socialNetworkService';
import { notifyService } from '../../../../../../services/notifyService';
import AddEditWrapper from '../../../../../../components/shared/antd/Table/Drawer/AddEditWrapper';

export default function AddEditBotFlow(props) {
  const { open, onClose, selectedData, action, pageId } = props;

  const [addEditWorkflowForm] = Form.useForm();
  const useCreateBotFlow = useMutation(createBotFlow, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Create bot flow successfully',
        });
        closeDrawer();
      }
    },
  });

  function handleSubmit(value) {
    if (action === 'Add') {
      useCreateBotFlow.mutate({
        name: value?.name,
        tabId: pageId,
        data: {
          nodes: [],
          edges: [],
          variables: [],
        },
      });
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
      loading={useCreateBotFlow.isLoading}
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
