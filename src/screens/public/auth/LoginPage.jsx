import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { customHistory } from '../../../routes/CustomRouter';
import { apiService } from '../../../services/apiService';
import { localStorageService } from '../../../services/localStorageService';
import { notifyService } from '../../../services/notifyService';
import useToggle from '../../../components/hooks/useToggle';
import ToolTipWrapper from '../../../components/shared/antd/ToolTipWrapper';
import authImage from '../../../assets/images/auth.png';
import './auth.scss';

export default function LoginPage() {
  const [loading, toggleLoading] = useToggle(false);

  async function handleSubmit(model) {
    toggleLoading(true);
    await apiService.post('/auth/log-in', model).then((resp) => {
      if (resp?.result) {
        localStorageService.setItem("token", resp.result?.access);
        customHistory.push('/');
        notifyService.showSucsessMessage(null, "Login successfully")
        // dont need to toggle loading
        // because it will redirect user
        return;
      }
    });
    toggleLoading(false);
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <h1 className="auth-title">Login</h1>
        <img src={authImage} width="140" alt="auth-pic" />
      </div>
      <div className="auth-body">
        <Form
          name="login-form"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <ToolTipWrapper
            tooltip="Only email is allowed"
            placement="topRight"
          >
            <Form.Item
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
              <Input
                placeholder="Email *"
                prefix={<UserOutlined />}
              />
            </Form.Item>
          </ToolTipWrapper>

          <ToolTipWrapper
            tooltip="Password must between 8 - 50"
            placement="topRight"
          >
            <Form.Item
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
              <Input.Password
                placeholder="Password *"
                prefix={<LockOutlined />}
              />
            </Form.Item>
          </ToolTipWrapper>

          {/* <Checkbox className="remember-auth">Remember me</Checkbox> */}

          <Button
            type="primary"
            htmlType="submit"
            className="submit-auth-btn"
            loading={loading}
          >
            Login
          </Button>
        </Form>
      </div>
      <div className="auth-footer">
        <span>Don't have account?</span>
        <Link to={'/register'} className="register-redirect">
          Register here
        </Link>
      </div>
    </div>
  );
}
