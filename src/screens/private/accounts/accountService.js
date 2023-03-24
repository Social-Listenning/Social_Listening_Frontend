import { useQuery } from 'react-query';
import { apiService } from '../../../services/apiService';
import environment from '../../../constants/environment/environment.dev';

export const createAccountAdmin = async (userModel) => {
  const resp = await apiService.post(
    `${environment.user}/create/admin`,
    userModel
  );
  return resp?.result;
};

export const updateAccountAdmin = async (userModel) => {
  const resp = await apiService.post(
    `${environment.user}/create/admin`,
    userModel
  );
  return resp?.result;
};
