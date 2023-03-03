import axios from 'axios';
import { localStorageService } from '../services/localStorageService';
import { notifyService } from '../services/notifyService';
import { customHistory } from '../routes/CustomRouter';
import environment from '../constants/environment/environment.dev';

const axiosInstance = axios.create({ baseURL: environment.baseUrl });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorageService.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    notifyService.showErrorMessage(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (resp) => {
    return resp;
  },
  (error) => {
    console.log(error)
    if (error.response.data.status === 401) {
      notifyService.showErrorMessage("Unauthorized");
      customHistory.push("/login");
    }
    else if (error.response.data.status === 403) {
      notifyService.showErrorMessage("Forbidden");
      customHistory.push("/forbidden");
    }
    // else if (error.response.status === 500) {
    //   notifyService.showErrorMessage("Server Error");
    //   customHistory.push("/error");
    // }
    else {
      if (error.response.data.message) {
        notifyService.showErrorMessage(error.response.data.message);
      }
    }
  }
);

export const apiService = axiosInstance;
