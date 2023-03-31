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
