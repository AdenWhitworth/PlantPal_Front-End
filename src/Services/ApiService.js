import {authClient, cookieClient, publicClient} from './ApiClient';

// Public API requests require API Key
export const postLogin = (userData) => publicClient.post('/users/login', userData);
export const postRegister = (userData) => publicClient.post('/users/register', userData);
export const postForgotPassword = (userData) => publicClient.post('/users/forgotPassword', userData);
export const postResetPassword = (userData) => publicClient.post('/users/resetPassword', userData);

// Authenticated API requests require Refresh Token
export const postRefreshAccessToken = () => cookieClient().post('/users/refreshAccessToken');

// Authenticated API requests with Access Token
export const postUpdateUser = (accessToken, setAccessToken, deviceDetails) => authClient(accessToken, setAccessToken).post('/users/updateUser', deviceDetails);
export const postAddDevice = (accessToken, setAccessToken, deviceDetails) => authClient(accessToken, setAccessToken).post('/dashboard/addDevice', deviceDetails);
export const postUpdatePumpWater = (accessToken, setAccessToken, deviceDetails) => authClient(accessToken, setAccessToken).post('/dashboard/updatePumpWater', deviceDetails);
export const postUpdateWifi = (accessToken, setAccessToken, deviceDetails) => authClient(accessToken, setAccessToken).post('/dashboard/updateWifi', deviceDetails);
export const postUpdateAuto = (accessToken, setAccessToken, deviceDetails) => authClient(accessToken, setAccessToken).post('/dashboard/updateAuto', deviceDetails);
export const getUserDevices = (accessToken, setAccessToken) => authClient(accessToken, setAccessToken).get('/dashboard/userDevices');
export const getDeviceLogs = (accessToken, setAccessToken, deviceDetails) => authClient(accessToken, setAccessToken).get('/dashboard/deviceLogs', deviceDetails);
export const getDeviceShadow = (accessToken, setAccessToken, deviceDetails) => authClient(accessToken, setAccessToken).get('/dashboard/deviceShadow', deviceDetails);
