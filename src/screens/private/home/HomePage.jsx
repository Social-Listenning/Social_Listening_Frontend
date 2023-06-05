import { useQueryClient } from 'react-query';
import ElementWithPermission from '../../../components/shared/element/ElementWithPermission';
import SocialNetworkPage from '../social-network/SocialNetworkPage';
import '../social-network/socialNetwork.scss';

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
        <div>
          
        </div>
      )}
    </>
  );
}
