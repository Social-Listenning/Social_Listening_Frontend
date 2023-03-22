import { Form, Input } from 'antd';
import { role } from '../../../../constants/profile/profile';
import AddEditWrapper from '../../../../components/shared/antd/Table/Drawer/AddEditWrapper';
import ClassicSelect from '../../../../components/shared/antd/Select/Classic';
import ToolTipWrapper from '../../../../components/shared/antd/ToolTipWrapper';

export default function AddEditAdminAccount(props) {
  const { open, onClose, data, action } = props;

  const [addEditUserForm] = Form.useForm();
console.log(data)
  return (
    <AddEditWrapper
      open={open}
      onClose={onClose}
      form={addEditUserForm}
    >
      <Form
        form={addEditUserForm}
        name="add-edit-user-form"
        layout="vertical"
        autoComplete="off"
        initialValues={{ ...data, role: data?.role?.roleName }}
        // onFinish={handleSubmit}
      >
        <ToolTipWrapper
          tooltip="Only email is allowed"
          placement="left"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Email is required',
              },
              {
                type: 'email',
                message: 'Only email is allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </ToolTipWrapper>

        <ToolTipWrapper
          tooltip="Password must between 8 - 50"
          placement="left"
        >
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  let errorMsg = 'Password is required';
                  if (value?.length >= 8 && value?.length <= 50) {
                    return Promise.resolve();
                  }
                  // if it not between 8 - 50, check it has value or not
                  // if it has value -> user already input the field
                  if (value?.length > 0) {
                    errorMsg = 'Password must between 8 - 50';
                  }
                  return Promise.reject(errorMsg);
                },
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </ToolTipWrapper>

        <ToolTipWrapper
          tooltip="Confirm password must match"
          placement="left"
        >
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: 'Confirm Password is required',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The confirm password do not match')
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </ToolTipWrapper>

        <ToolTipWrapper
          tooltip="You can only create Admin accounts"
          placement="left"
        >
          <Form.Item label="Role" name="role">
            <ClassicSelect options={role} disabled />
          </Form.Item>
        </ToolTipWrapper>

        <Form.Item label="Full Name" name="fullName">
          <Input />
        </Form.Item>

        <Form.Item label="User Name" name="userName">
          <Input />
        </Form.Item>

        <ToolTipWrapper
          tooltip="Only 10-digit phone number allowed"
          placement="left"
        >
          <Form.Item
            label="Phone"
            name="phoneNumber"
            rules={[
              {
                pattern: /^\d{10}$/,
                message: 'Phone number is not valid',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </ToolTipWrapper>
      </Form>
    </AddEditWrapper>
  );
}
