import { useQuery } from 'react-query';
import { apiService } from '../../../services/apiService';
import environment from '../../../constants/environment/environment.dev';

export const getSocialGroups = async () => {
  const resp = await apiService.get(
    `${environment.socialGroup}/social-tab`
  );
  return resp?.result;
};

export const useGetSocialGroups = (enabled = true) => {
  return useQuery('socialGroups', getSocialGroups, {
    enabled: enabled,
  });
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
    `${environment.facebookGraph}/${data?.userId}/accounts?access_token=${data?.userToken}&fields=access_token,picture,name,cover,fan_count`
  );
  return resp;
};

export const disconnectFacebook = async (data) => {
  const resp = await apiService.delete(
    `${environment.facebookGraph}/${data?.pageId}/subscribed_apps?access_token=${data?.accessToken}&app_id=${data?.appId}`
  );
  return resp;
};
