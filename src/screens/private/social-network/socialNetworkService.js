import { useQuery } from 'react-query';
import { apiService } from '../../../services/apiService';
import environment from '../../../constants/environment/environment.dev';
import axios from 'axios';

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

// #region facebook API
export const subscribeFacebookPage = async (data) => {
  const resp = await apiService.post(
    `${environment.facebookGraph}/${data?.pageId}/subscribed_apps?access_token=${data?.accessToken}`,
    {
      access_token: data?.accessToken,
      subscribed_fields: 'feed',
    }
  );
  return resp;
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

export const replyFbMessage = async (data) => {
  const resp = await axios.post(
    `${environment.facebookGraph}/${data?.cmtId}/comments?access_token=${data?.accessToken}`,
    {
      message: data?.message,
    }
  );
  return resp?.data;
};

export const extendFbToken = async (data) => {
  const resp = await axios.get(
    `${environment.facebookGraph}/oauth/access_token?grant_type=fb_exchange_token&client_id=${data?.appId}&client_secret=${data?.appSecret}&fb_exchange_token=${data?.accessToken}`
  );
  return resp?.data;
};
// #endregion

export const getMessageDetail = async (messageId) => {
  const resp = await apiService.get(
    `${environment.socialMessage}/${messageId}`
  );
  return resp?.result;
};

export const useGetMessageDetail = (messageId, enabled = true) => {
  return useQuery(
    'messageDetail',
    () => getMessageDetail(messageId),
    {
      enabled: enabled,
    }
  );
};

export const getTabSetting = async (pageId) => {
  const resp = await apiService.get(
    `${environment.socialTabSetting}/${pageId}`
  );
  return resp?.result;
};

export const useGetTabSetting = (pageId, enabled = true) => {
  return useQuery('tabSetting', () => getTabSetting(pageId), {
    enabled: enabled,
  });
};

export const updateSocialSetting = async (data) => {
  const resp = await apiService.put(
    `${environment.socialTabSetting}/${data?.id}/update`,
    data?.data
  );
  return resp?.result;
};

export const saveMessageToSystem = async (data) => {
  const resp = await apiService.post(
    `${environment.socialMessage}/save`,
    data
  );
  return resp?.result;
};

export const getSocialPost = async (id) => {
  const resp = await apiService.get(
    `${environment.socialPost}/${id}`
  );
  return resp?.result;
};

export const useGetSocialPost = (id, enabled = true) => {
  return useQuery('socialPost', () => getSocialPost(id), {
    enabled: enabled,
  });
};

export const createBotFlow = async (data) => {
  const resp = await apiService.post(
    `${environment.workflow}/create`,
    data
  );
  return resp?.result;
};

export const updateBotFlow = async (data) => {
  const resp = await apiService.put(
    `${environment.workflow}/${data?.id}/update`,
    data?.body
  );
  return resp?.result;
};

export const changeStatusBotFlow = async (data) => {
  const resp = await apiService.put(
    `${environment.workflow}/${data?.id}/active`,
    data?.body
  );
  return resp?.result;
};
