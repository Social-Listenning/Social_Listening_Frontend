import { apiService } from '../../../services/apiService';
import useEffectOnce from '../../../components/hooks/useEffectOnce';
import NotConnected from './NotConnected';

export default function SocialNetworkPage() {
  useEffectOnce(() => {
    apiService
      .post('/socialNetwork/connect', {
        socialType: 'Facebook',
        name: 'KaiNe',
        extendData: JSON.stringify({ id: 123456789 }),
      })
      .then((resp) => {
        console.log(resp);
      });

    apiService.get('/socialGroup').then((resp) => {
      console.log(resp);
    });
  });

  return (
    <div className="flex-center social-network">
      <NotConnected />
    </div>
  );
}
