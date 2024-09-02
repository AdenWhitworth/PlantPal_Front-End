import axios from 'axios';
import { postRefreshAccessToken } from './ApiService';

const createBaseClient = (baseURL, headers = {}) => {
  return axios.create({
    baseURL,
    headers,
    withCredentials: true,
  });
};

const setupInterceptors = (client, setAccessToken) => {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await postRefreshAccessToken();
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


export const cookieClient = () => {
    return createBaseClient(process.env.REACT_APP_BASE_URL, {
        "x-api-key": process.env.REACT_APP_API_CLIENT_KEY,
    });
};

export const publicClient = createBaseClient(process.env.REACT_APP_BASE_URL, {
  'x-api-key': process.env.REACT_APP_API_CLIENT_KEY,
});