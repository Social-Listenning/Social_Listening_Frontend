import { useQuery } from 'react-query';
import { apiService } from '../../services/apiService';
import environment from '../../constants/environment/environment.dev';

export const getAllRole = async () => {
  const resp = await apiService.get(environment.role);
  return resp?.result;
};
export const useGetAllRole = () => {
  return useQuery('allRole', getAllRole);
};

