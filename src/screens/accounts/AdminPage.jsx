import { Form, Input, Checkbox, Button } from 'antd';
import { apiService } from '../../services/apiService';
import { notifyService } from '../../services/notifyService';
import useToggle from '../../hooks/useToggle';
import DraggableModal from '../../components/shared/antd/DraggableModal';
import ToolTipWrapper from '../../components/shared/antd/ToolTipWrapper';

export default function AdminPage() {
  const [open, toggleOpen] = useToggle(true);
  const [form] = Form.useForm();

  async function handleSubmit(model) {
    console.log(model)
    // toggleLoading(true);
    // await apiService.post('/auth/log-in', model).then((resp) => {
    //   if (resp?.data?.result) {
    //     notifyService.showSucsessMessage('Login successfully');
    //     // dont need to toggle loading
    //     // because it will redirect user
    //     return;
    //   }
    // });
    // toggleLoading(false);
  }

  return (
    <DraggableModal
      open={open}
      toggleOpen={toggleOpen}
      closable={false}
      footer={
        <Button
          type="primary"
          htmlType="submit"
          className="submit-auth-btn"
          // loading={loading}
          onClick={form.submit}
        >
          OK
        </Button>
      }
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        size="large"
      >
        {/* <ToolTipWrapper
          tooltip="Only company is allowed"
          placement="topRight"
        > */}
          <Form.Item
            name="company"
            rules={[
              {
                required: true,
                message: 'Company is required',
              },
            ]}
          >
            <Input placeholder="Company *" />
          </Form.Item>
        {/* </ToolTipWrapper> */}
      </Form>
    </DraggableModal>
  );
}
