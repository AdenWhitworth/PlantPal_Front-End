import axios from 'axios';

const createClient = (token) => {
  return axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
};

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      "x-api-key": process.env.REACT_APP_API_CLIENT_KEY,
    },
});

const authClientFactory = (token) => {
  const authClient = createClient(token);

  return {
    post: (url, data) => authClient.post(url, data),
    get: (url, params) => authClient.get(url, params),
  };
};

// Public API requests
export const postLogin = (userData) => client.post('/users/login', userData);

export const postRegister = (userData) => client.post('/users/register', userData);

// Authenticated API requests
export const postUpdateUser = (token, userDetails) => 
  authClientFactory(token).post('/users/updateUser', userDetails);

export const postAddDevice = (token, userDetails) => 
  authClientFactory(token).post('/dashboard/addDevice', userDetails);

export const postUpdatePumpWater = (token, userDetails) => 
  authClientFactory(token).post('/dashboard/updatePumpWater', userDetails);

export const postUpdateWifi = (token, userDetails) => 
  authClientFactory(token).post('/dashboard/updateWifi', userDetails);

export const getUserDevices = (token) => 
  authClientFactory(token).get('/dashboard/userDevices');

export const getDeviceLogs = (token, userDetails) => 
  authClientFactory(token).get('/dashboard/deviceLogs', userDetails);

export const getDeviceShadow = (token, userDetails) => 
  authClientFactory(token).get('/dashboard/deviceShadow', userDetails);

export const postUpdateAuto = (token, userDetails) => 
  authClientFactory(token).post('/dashboard/updateAuto', userDetails);
