import environment from '../../../constants/environment/environment.dev';
import { apiService } from '../../../services/apiService';

export const updateSetting = async (data) => {
  const resp = apiService.put(
    `${environment.setting}/update-setting`,
    data
  );
  return resp;
};
