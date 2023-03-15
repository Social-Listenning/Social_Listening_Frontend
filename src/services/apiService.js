import axios from 'axios';
import { notifyService } from '../services/notifyService';
import { customHistory } from '../routes/CustomRouter';
import environment from '../constants/environment/environment.dev';

const axiosInstance = axios.create({ baseURL: environment.baseUrl });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    notifyService.showErrorMessage(null, error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (resp) => {
    if (resp?.data?.message) {
      notifyService.showErrorMessage(null, resp.data.message);
    }
    return resp?.data;
  },
  (error) => {
    console.log(error);
    if (error.response.status === 401) {
      notifyService.showErrorMessage(null, 'Unauthorized');
      customHistory.push('/login');
    } else if (error.response.status === 403) {
      notifyService.showErrorMessage(null, 'Forbidden Resource');
      customHistory.push('/forbidden');
    }
    // else if (error.response.status === 500) {
    //   notifyService.showErrorMessage(null, "Server Error");
    //   customHistory.push("/error");
    // }
    else {
      if (error.response.data.message) {
        notifyService.showErrorMessage(null, error.response.data.message);
      } else {
        notifyService.showErrorMessage(null, error.message);
      }
    }
  }
);

export const apiService = axiosInstance;
