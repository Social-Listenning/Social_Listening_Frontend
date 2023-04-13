import ElementWithPermission from '../../../components/shared/element/ElementWithPermission';
import SocialNetworkPage from '../social-network/SocialNetworkPage';
import '../social-network/socialNetwork.scss';

export default function HomePage() {
  return (
    <ElementWithPermission permission="connect-social-network">
      <SocialNetworkPage />
    </ElementWithPermission>
  );
}
