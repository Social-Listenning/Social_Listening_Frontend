import { apiService } from '../../../services/apiService';
import environment from '../../../constants/environment/environment.dev';

export const createAccount = async (userModel) => {
  let url = `${environment.user}/create`;
  if (userModel?.role === 'ADMIN') {
    url.concat(`/admin`);
  }
  const resp = await apiService.post(url, userModel?.data);
  return resp?.result;
};

export const editAccount = async (userModel) => {
  const resp = await apiService.post(
    `${environment.user}/edit`,
    userModel
  );
  return resp?.result;
};

export const assignUser = async (data) => {
  const resp = await apiService.post(
    `${environment.user}/assign`,
    data
  );
  return resp?.result;
};

export const getScreens = async () => {
  const resp = await apiService.post(
    `${environment.permission}/get-screens`
  );
  return resp?.result;
};

export const getPermissionByScreens = async (screen) => {
  const resp = await apiService.post(
    `${environment.permission}/find-permission`,
    screen
  );
  return resp?.result;
};

export const assignPermission = async (data) => {
  const resp = await apiService.post(
    `${environment.permission}/assign`,
    data
  );
  return resp?.result;
};

export const removePermission = async (data) => {
  const resp = await apiService.post(
    `${environment.permission}/remove`,
    data
  );
  return resp?.result;
};

export const activateUser = async (id) => {
  const resp = await apiService.post(
    `${environment.user}/activate/${id}`
  );
  return resp?.result;
};

export const deactivateUser = async (id) => {
  const resp = await apiService.post(
    `${environment.user}/activate/${id}`
  );
  return resp?.result;
};

export const getUserNameById = async (id) => {
  const resp = await apiService.get(`${environment.user}/${id}`);
  return {
    id: id,
    name: resp?.result,
  };
};

export const updateYourAccount = async (data) => {
  const resp = await apiService.post(
    `${environment.auth}/update-account`,
    data
  );
  return resp?.result;
};

export const updatePassword = async (data) => {
  const resp = await apiService.post(
    `${environment.auth}/update-password`,
    data
  );
  return resp?.result;
};

export const updateRole = async (data) => {
  const resp = await apiService.post(
    `${environment.user}/role/update`,
    data
  );
  return resp?.result;
};
