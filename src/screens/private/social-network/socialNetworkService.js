import { useQuery } from 'react-query';
import { apiService } from '../../../services/apiService';
import environment from '../../../constants/environment/environment.dev';

export const getSocialGroups = async () => {
  const resp = await apiService.get(`${environment.socialGroup}/social-tab`);
  return resp?.result;
};

export const useGetSocialGroups = async () => {
  return useQuery('socialGroups', getSocialGroups);
};

export const connectPageToSystem = async (data) => {
  const resp = await apiService.post(
    `${environment.socialNetwork}/connect`,
    data
  );
  return resp?.result;
};

export const connectFacebook = async (data) => {
  const resp = await apiService.get(
    `${environment.facebookGraph}/${data?.userId}/accounts?access_token=${data?.userToken}&fields=picture,name`
  );
  return resp;
};
