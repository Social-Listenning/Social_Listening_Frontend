import { useJwt } from 'react-jwt';
import { localStorageService } from '../../../services/localStorageService';

export default function ProfilePage() {
  const token = localStorageService.getItem('token');
  const { decodedToken, isExpired } = useJwt(token);

  return <div>ProfilePage</div>;
}
