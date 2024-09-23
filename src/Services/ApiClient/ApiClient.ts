import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { postRefreshAccessToken } from '../ApiService/ApiService';
import { ErrorResponse } from './ApiClientTypes';

/**
 * Creates a base Axios client with the provided base URL and headers.
 * 
 * @function
 * @param {string} baseURL - The base URL for the Axios instance.
 * @param {Record<string, string>} headers - Optional headers to be set for the Axios instance.
 * @returns {AxiosInstance} - The Axios instance configured with the base URL and headers.
 */
const createBaseClient = (baseURL: string, headers: Record<string,string> = {}): AxiosInstance => {
  return axios.create({
    baseURL,
    headers,
    withCredentials: true,
  });
};

/**
 * Sets up interceptors for the provided Axios client to handle token refresh on 401 or token expiration errors.
 * 
 * @function
 * @param {AxiosInstance} client - The Axios instance to configure interceptors for.
 * @param {function} setAccessToken - A function to update the access token.
 */
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

          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          }

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

/**
 * Creates an authenticated Axios client with an access token and sets up token refresh interceptors.
 * 
 * @function
 * @param {string | null} accessToken - The access token for the client, can be null if not authenticated.
 * @param {function} setAccessToken - A function to update the access token when it is refreshed.
 * @returns {AxiosInstance} - The authenticated Axios client.
 */
export const authClient = (accessToken: string | null, setAccessToken: (value: string) => void): AxiosInstance => {
  const client = createBaseClient(process.env.REACT_APP_BASE_URL as string, {
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
  });
  setupInterceptors(client, setAccessToken);
  return client;
};

/**
 * Creates a cookie-based Axios client that sends the API client key in headers.
 * 
 * @function
 * @returns {AxiosInstance} - The Axios client configured with API key for cookie-based requests.
 */
export const cookieClient = (): AxiosInstance => {
    return createBaseClient(process.env.REACT_APP_BASE_URL as string, {
        "x-api-key": process.env.REACT_APP_API_CLIENT_KEY as string,
    });
};

/**
 * A public Axios client that uses the API client key for unauthenticated requests.
 * 
 * @function
 * @returns {AxiosInstance}
 */
export const publicClient = createBaseClient(process.env.REACT_APP_BASE_URL as string, {
  'x-api-key': process.env.REACT_APP_API_CLIENT_KEY as string,
});