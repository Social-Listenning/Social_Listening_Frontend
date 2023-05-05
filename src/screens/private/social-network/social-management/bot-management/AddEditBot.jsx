import { Form, Input } from 'antd';
import { useMutation } from 'react-query';
import { notifyService } from '../../../../../services/notifyService';
import {
  createDialogflowBot,
  updateDialogflowBot,
} from '../../socialNetworkService';
import useEffectOnce from '../../../../../components/hooks/useEffectOnce';
import AddEditWrapper from '../../../../../components/shared/antd/Table/Drawer/AddEditWrapper';

export default function AddEditBot(props) {
  const { open, onClose, selectedData, action } = props;

  const [addEditBotForm] = Form.useForm();
  const useCreateDialogflowBot = useMutation(createDialogflowBot, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Create bot successfully',
        });
        closeDrawer();
      }
    },
  });

  const useUpdateDialogflowBot = useMutation(updateDialogflowBot, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Update bot successfully',
        });
        closeDrawer();
      }
    },
  });

  useEffectOnce(() => {
    addEditBotForm.setFieldsValue({
      name: selectedData?.display_name,
    });
  });

  function handleSubmit(value) {
    if (action === 'Add') {
      useCreateDialogflowBot.mutate(value?.name);
    } else if (action === 'Edit') {
      let id = null;
      if (selectedData) {
        const splitName = selectedData?.name?.split('/');
        id = splitName[splitName?.length - 1];
      }

      useUpdateDialogflowBot.mutate({
        id: id,
        name: value?.name,
      });
    }
  }

  function closeDrawer() {
    onClose();
    addEditBotForm.resetFields();
  }

  return (
    <AddEditWrapper
      open={open}
      onClose={closeDrawer}
      form={addEditBotForm}
      loading={
        useCreateDialogflowBot.isLoading ||
        useUpdateDialogflowBot.isLoading
      }
    >
      <Form
        form={addEditBotForm}
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
