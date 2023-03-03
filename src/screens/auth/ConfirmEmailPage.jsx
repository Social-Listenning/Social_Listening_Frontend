import { Button } from 'antd';
import { MailTwoTone } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { customHistory } from '../../routes/CustomRouter';
import './auth.scss';

export default function ConfirmEmail() {
  const location = useLocation();
  const email = location.state?.email;
  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <MailTwoTone style={{ fontSize: '12rem' }} />
        <h1 className="auth-title" style={{ fontSize: '3.4rem' }}>
          Thanks for your signing up!
        </h1>
      </div>
      <div className="auth-body" style={{ padding: 0 }}>
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          We're happy you signed up for Social Listening. To start
          exploring the app, please verify that {email} is your email
          address.
        </div>
      </div>
      <div className="auth-footer flex-center">
        <Button
          type="primary"
          className="redirect-btn"
          onClick={() => {
            customHistory.push('/login');
          }}
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
}
