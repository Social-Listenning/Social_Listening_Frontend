import { Button } from 'antd';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { apiService } from '../../../../services/apiService';
import { notifyService } from '../../../../services/notifyService';
import { customHistory } from '../../../../routes/CustomRouter';
import environment from '../../../../constants/environment/environment.dev';
import useToggle from '../../../../components/hooks/useToggle';
import useEffectOnce from '../../../../components/hooks/useEffectOnce';
import '../auth.scss';

export default function VerifyEmailPage() {
  const location = useLocation();
  const [correctToken, setCorrectToken] = useToggle(false);

  useEffectOnce(() => {
    const queryParams = location?.search;
    if (queryParams && queryParams?.includes('?token=')) {
      const token = queryParams.substring(7);
      if (token) {
        setCorrectToken(true);
        try {
          apiService
            .post(`${environment.auth}/confirm-email`, {
              token: token,
            })
            .then((resp) => {
              if (resp?.result) {
                notifyService.showSucsessMessage({
                  description: 'Verify email successfully',
                });
              } else {
                setCorrectToken(false);
              }
            });
        } catch (ex) {
          setCorrectToken(false);
          notifyService.showErrorMessage({
            description: ex.message,
          });
        }
      }
    }
  });

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        {correctToken ? (
          <CheckCircleTwoTone style={{ fontSize: '12rem' }} />
        ) : (
          <CloseCircleTwoTone
            twoToneColor="#ff5656"
            style={{ fontSize: '12rem' }}
          />
        )}
        <h1 className="auth-title" style={{ fontSize: '3.4rem' }}>
          {correctToken
            ? `Thanks for verifying your email address!`
            : `Invalid token!`}
        </h1>
      </div>
      <div className="auth-body" style={{ padding: 0 }}>
        {correctToken ? (
          <>
            <div
              style={{ marginBottom: '1.2rem', textAlign: 'center' }}
            >
              Verifying your email address is a simple way to prove
              that you're a real Perspective user and makes your
              account more secure. It also helps the system works as
              it should.
            </div>
            <div
              style={{ marginBottom: '2.8rem', textAlign: 'center' }}
            >
              Now you can go out and use all the features of our
              system. Enjoy!
            </div>
          </>
        ) : null}
      </div>
      <div className="auth-footer flex-center">
        <Button
          type="primary"
          className="redirect-btn"
          onClick={() => {
            customHistory.push('/login');
          }}
        >
          Back to login
        </Button>
      </div>
    </div>
  );
}
