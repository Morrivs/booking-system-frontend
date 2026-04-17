import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

export const api = axios.create({
  //URL base para todas las peticiones, se lee de las variables de entorno
  baseURL: import.meta.env.VITE_API_URL_DEV || import.meta.env.VITE_API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { token } = useAuthStore.getState();

    if (error.response?.status === 401 && !originalRequest._retry && token) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          'http://localhost:3000/auth/refresh',
          {},
          { withCredentials: true }
        );

        const { access_token, user } = res.data;

        useAuthStore.getState().login({
          user,
          token: access_token,
        });

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);

      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);