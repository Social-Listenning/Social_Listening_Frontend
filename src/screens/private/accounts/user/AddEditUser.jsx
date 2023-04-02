import { Form, Input } from 'antd';
import { useMutation, useQueryClient } from 'react-query';
import { gender } from '../../../../constants/environment/environment.dev';
import { notifyService } from '../../../../services/notifyService';
import { createAccountAdmin } from '../accountService';
import useUpdateEffect from '../../../../components/hooks/useUpdateEffect';
import AddEditWrapper from '../../../../components/shared/antd/Table/Drawer/AddEditWrapper';
import ClassicSelect from '../../../../components/shared/antd/Select/Classic';
import ToolTipWrapper from '../../../../components/shared/antd/ToolTipWrapper';

export default function AddEditAdminAccount(props) {
  const { open, onClose, selectedData, action } = props;

  const [addEditUserForm] = Form.useForm();
  const queryClient = useQueryClient();
  const roleData = queryClient.getQueryData('allRole');
  const useCreateAccountAdmin = useMutation(createAccountAdmin, {
    onSuccess: (resp) => {
      if (resp) {
        notifyService.showSucsessMessage({
          description: 'Create new user successfully',
        });
        closeDrawer()
      }
    },
  });

  useUpdateEffect(() => {
    addEditUserForm.setFieldsValue({
      email: selectedData?.email,
      userName: selectedData?.userName,
      fullName: selectedData?.fullName,
      phoneNumber: selectedData?.phoneNumber,
      role: selectedData?.role?.roleName ?? 'ADMIN',
      gender: selectedData?.gender ?? 'Other',
    });
  }, [action]);

  async function handleSubmit(value) {
    // #region format value
    const formatValue = {
      ...value,
      roleId: roleData?.filter((r) => r.roleName === value.role)[0]
        ?.id,
    };
    delete formatValue.role;
    delete formatValue.confirmPassword;
    // #endregion

    if (action === 'Add') {
      useCreateAccountAdmin.mutate(formatValue);
    } else if (action === 'Edit') {
      console.log('b');
    }
  }

  function closeDrawer() {
    onClose();
    addEditUserForm.resetFields();
  }

  return (
    <AddEditWrapper
      open={open}
      onClose={closeDrawer}
      form={addEditUserForm}
      loading={useCreateAccountAdmin.isLoading}
    >
      <Form
        form={addEditUserForm}
        name="add-edit-user-form"
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
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
          {...(action === 'Add' && {
            tooltip: 'You can only create Admin accounts',
          })}
          placement="left"
        >
          <Form.Item label="Role" name="role">
            <ClassicSelect disabled />
          </Form.Item>
        </ToolTipWrapper>

        <Form.Item
          label="User Name"
          name="userName"
          rules={[
            {
              required: true,
              message: 'User name is required',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Gender" name="gender">
          <ClassicSelect options={gender} />
        </Form.Item>

        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            {
              required: true,
              message: 'Full Name is required',
            },
          ]}
        >
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
