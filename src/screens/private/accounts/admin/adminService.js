import { useQuery } from 'react-query';
import { apiService } from '../../../../services/apiService';
import environment from '../../../../constants/environment/environment.dev';

export const createAdmin = async (userModel) => {
  const resp = await apiService.post(
    `${environment.user}/create/admin`,
    userModel
  );
  return resp?.result;
};
