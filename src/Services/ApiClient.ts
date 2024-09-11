import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { postRefreshAccessToken } from './ApiService';

const createBaseClient = (baseURL: string, headers: Record<string,string> = {}): AxiosInstance => {
  return axios.create({
    baseURL,
    headers,
    withCredentials: true,
  });
};

interface ErrorResponse {
  message?: string;
}

const setupInterceptors = (client: AxiosInstance, setAccessToken: (value: string) => void) => {
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config || {};
      if (
        (error.response?.status === 401 && !originalRequest._retry) ||
        (error.response?.status === 500 && (error.response.data as ErrorResponse).message === "Invalid or expired token: jwt expired" && !originalRequest._retry)
      ) {
        
        originalRequest._retry = true;

        try {
          const response = await postRefreshAccessToken();
          const newAccessToken = response.data.accessToken;

          originalRequest.headers = {
            ...originalRequest.headers,
            'Authorization': `Bearer ${newAccessToken}`,
        };

          setAccessToken(newAccessToken);

          return client(originalRequest);
        } catch (error: any) {
          console.error('Failed to refresh token', error);
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
};

export const authClient = (accessToken: string | null, setAccessToken: (value: string) => void) => {
  const client = createBaseClient(process.env.REACT_APP_BASE_URL as string, {
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
  });
  setupInterceptors(client, setAccessToken);
  return client;
};


export const cookieClient = () => {
    return createBaseClient(process.env.REACT_APP_BASE_URL as string, {
        "x-api-key": process.env.REACT_APP_API_CLIENT_KEY as string,
    });
};

export const publicClient = createBaseClient(process.env.REACT_APP_BASE_URL as string, {
  'x-api-key': process.env.REACT_APP_API_CLIENT_KEY as string,
});