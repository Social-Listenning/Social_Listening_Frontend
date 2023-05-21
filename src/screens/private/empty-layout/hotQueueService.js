import { useQuery } from 'react-query';
import { apiService } from '../../../services/apiService';
import environment from '../../../constants/environment/environment.dev';

export const getHotqueueInfo = async (senderId) => {
  const resp = await apiService.get(
    `${environment.hotQueue}/sender/${senderId}`
  );
  return resp?.result;
};

export const useGetHotqueueInfo = (senderId, enabled) => {
  return useQuery('hotQueueInfo', () => getHotqueueInfo(senderId), {
    enabled: enabled,
  });
};
