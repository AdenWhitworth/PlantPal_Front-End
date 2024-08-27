import axios from 'axios';
import Cookies from 'js-cookie';
import { postRefreshAccessToken } from './ApiService';

const createBaseClient = (baseURL, headers = {}) => {
  return axios.create({
    baseURL,
    headers,
  });
};

const getRefreshTokenFromCookie = () => Cookies.get('refreshToken');

const setupInterceptors = (client, setAccessToken) => {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = getRefreshTokenFromCookie();
          const response = await postRefreshAccessToken(refreshToken);
          const newAccessToken = response.data.accessToken;

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          setAccessToken(newAccessToken);

          return client(originalRequest);
        } catch (refreshError) {
          console.error('Failed to refresh token', refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export const authClient = (accessToken, setAccessToken) => {
  const client = createBaseClient(process.env.REACT_APP_BASE_URL, {
    Authorization: `Bearer ${accessToken}`,
  });
  setupInterceptors(client, setAccessToken);
  return client;
};

export const cookieClient = (refreshToken) => {
    return createBaseClient(process.env.REACT_APP_BASE_URL, {
        "x-api-key": process.env.REACT_APP_API_CLIENT_KEY,
        'Cookie': `refreshToken=${refreshToken}`,
    });
};

export const publicClient = createBaseClient(process.env.REACT_APP_BASE_URL, {
  'x-api-key': process.env.REACT_APP_API_CLIENT_KEY,
});