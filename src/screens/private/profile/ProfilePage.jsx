import { Form, Input, Radio } from 'antd';
import { decodeToken } from 'react-jwt';
import { localStorageService } from '../../../services/localStorageService';
import { apiService } from '../../../services/apiService';
import { notifyService } from '../../../services/notifyService';
import { Checker } from '../../../utils/dataChecker';
import { gender } from '../../../constants/profile/profile';
import useEffectOnce from '../../../components/hooks/useEffectOnce';
import useToggle from '../../../components/hooks/useToggle';
import SaveButton from '../../../components/shared/element/Button/SaveButton';
import './profile.scss';

export default function ProfilePage() {
  const token = localStorageService.getItem('token');
  const decodedToken = decodeToken(token);

  const [accountForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  useEffectOnce(() => {
    if (!Checker.isEmptyObject(decodedToken, true)) {
      accountForm.setFieldsValue({ email: decodedToken?.email });
      profileForm.setFieldsValue({
        fullName: decodedToken?.fullName,
        userName: decodedToken?.userName,
        gender: decodedToken?.gender ?? 'male',
        phoneNumber: decodedToken?.phoneNumber,
        role: decodedToken?.role,
      });
    }
  });

  const [loading, toggleLoading] = useToggle(false);
  async function handleSave() {
    toggleLoading(true);
    const accountProfile = {
      ...accountForm.getFieldsValue(),
      ...profileForm.getFieldsValue(),
    };

    await apiService.post('', accountProfile).then((resp) => {
      if (resp?.result) {
        notifyService.showSucsessMessage(
          null,
          'Save profile successfully'
        );
      }
    });
    toggleLoading(false);
  }

  return (
    <div className="profile-wrapper full-height flex-center">
      <div className="profile-left-section full-height flex-center">
        <img
          className="profile-img"
          src="https://i.pinimg.com/736x/25/78/61/25786134576ce0344893b33a051160b1.jpg"
          alt="profile-avt"
        />
        <Form
          form={accountForm}
          name="account-form"
          layout="vertical"
          autoComplete="off"
          // onFinish={handleSubmit}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Only email is allowed',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                validator: (_, value) => {
                  if (value?.length >= 8 && value?.length <= 50) {
                    return Promise.resolve();
                  }
                  if (value?.length > 0) {
                    return Promise.reject(
                      'Password must between 8 - 50'
                    );
                  }
                },
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
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
        </Form>
      </div>
      <div className="profile-right-section full-height flex-center">
        <Form
          form={profileForm}
          name="profile-form"
          autoComplete="off"
          labelCol={{
            span: 4,
          }}
          // wrapperCol={{
          //   span: 14,
          // }}
        >
          <Form.Item label="Full Name" name="fullName">
            <Input />
          </Form.Item>

          <Form.Item label="User Name" name="userName">
            <Input />
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Radio.Group options={gender} />
          </Form.Item>

          <Form.Item label="Phone" name="phoneNumber">
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Input />
          </Form.Item>
        </Form>

        <SaveButton onClick={handleSave} loading={loading} />
      </div>
    </div>
  );
}
