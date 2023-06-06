import {
  UserAddOutlined,
  UserDeleteOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
} from '@ant-design/icons';
import { useQueryClient } from 'react-query';
import ElementWithPermission from '../../../components/shared/element/ElementWithPermission';
import SocialNetworkPage from '../social-network/SocialNetworkPage';
import '../social-network/socialNetwork.scss';
import './home.scss';

export default function HomePage() {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData('userData');

  return (
    <>
      {userData?.role !== 'ADMIN' ? (
        <ElementWithPermission permission="connect-social-network">
          <SocialNetworkPage />
        </ElementWithPermission>
      ) : (
        <div className="home-container">
          <div className="block-container">
            <div
              className="block flex-center"
              style={{ backgroundColor: 'var(--primary-color)' }}
            >
              <UserAddOutlined />
              <div>Total User Active: 100</div>
            </div>
            <div
              className="block flex-center"
              style={{ backgroundColor: '#36b9cc' }}
            >
              <UserDeleteOutlined />
              <div>Total User Inactive: 100</div>
            </div>
            <div
              className="block flex-center"
              style={{ backgroundColor: 'var(--success-color)' }}
            >
              <FileDoneOutlined />
              <div>Total Page Active: 100</div>
            </div>
            <div
              className="block flex-center"
              style={{ backgroundColor: '#f6c23e' }}
            >
              <FileExclamationOutlined />
              <div>Total Page Inactive: 100</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
