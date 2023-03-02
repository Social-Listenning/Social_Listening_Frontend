import { Form, Input, Checkbox, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import authImage from '../../assets/images/auth.png';
import './auth.scss';

export default function LoginPage() {
  function handleSubmit(e) {
    console.log(e);
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
          initialValues={{
            agree: true,
          }}
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Username is required',
              },
            ]}
          >
            <Input placeholder="Username" prefix={<UserOutlined />} />
          </Form.Item>

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
                    errorMsg = 'Password must be between 8 - 50';
                  }
                  return Promise.reject(errorMsg);
                },
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Checkbox className="remember-auth">Remember me</Checkbox>

          <Button
            type="primary"
            htmlType="submit"
            className="submit-auth-btn"
          >
            Login
          </Button>
        </Form>
      </div>
      <div className="auth-footer">
        <span>Not a member yet?</span>
        <Link to={'/register'} className="register-redirect">
          Register here
        </Link>
      </div>
    </div>
  );
}
