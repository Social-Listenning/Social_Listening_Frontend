import { useQuery } from 'react-query';
import { decodeToken } from 'react-jwt';
import { apiService } from '../../services/apiService';
import environment from '../../constants/environment/environment.dev';

export const getDecodedToken = () => {
  return decodeToken(localStorage.getItem('token'));
};

export const useGetDecodedToken = () => {
  return useQuery('userData', getDecodedToken, {
    // staleTime: Infinity,
    keepPreviousData: true,
  });
};

export const getAllRole = async () => {
  const resp = await apiService.get(environment.role);
  return resp?.result;
};

export const useGetAllRole = (enabled = true) => {
  return useQuery('allRole', getAllRole, {
    // staleTime: Infinity,
    enabled: enabled,
    keepPreviousData: true,
  });
};

export const getAllNotification = async (page) => {
  const resp = await apiService.post(environment.notification, page);
  return resp?.result;
};
