import {authClient, cookieClient, publicClient} from '../ApiClient/ApiClient';
import { UserData, DeviceData, WifiData, AutoData, PumpData } from './ApiServiceTypes';


// Public API requests require API Key
export const postLogin = (userData: UserData) => publicClient.post('/users/login', userData);
export const postRegister = (userData: UserData) => publicClient.post('/users/register', userData);
export const postForgotPassword = (userData: UserData) => publicClient.post('/users/forgotPassword', userData);
export const postResetPassword = (userData: UserData) => publicClient.post('/users/resetPassword', userData);

// Authenticated API requests require Refresh Token
export const postRefreshAccessToken = () => cookieClient().post('/users/refreshAccessToken');

// Authenticated API requests with Access Token
export const postUpdateUser = (accessToken: string | null, setAccessToken: (value: string) => void, userData: UserData) => authClient(accessToken, setAccessToken).post('/users/updateUser', userData);
export const postAddDevice = (accessToken: string | null, setAccessToken: (value: string) => void, deviceData: DeviceData) => authClient(accessToken, setAccessToken).post('/dashboard/addDevice', deviceData);
export const postUpdatePumpWater = (accessToken: string | null, setAccessToken: (value: string) => void, pumpData: PumpData) => authClient(accessToken, setAccessToken).post('/dashboard/updatePumpWater', pumpData);
export const postUpdateWifi = (accessToken: string | null, setAccessToken: (value: string) => void, wifiData: WifiData) => authClient(accessToken, setAccessToken).post('/dashboard/updateWifi', wifiData);
export const postUpdateAuto = (accessToken: string | null, setAccessToken: (value: string) => void, auotData: AutoData) => authClient(accessToken, setAccessToken).post('/dashboard/updateAuto', auotData);
export const getUserDevices = (accessToken: string | null, setAccessToken: (value: string) => void) => authClient(accessToken, setAccessToken).get('/dashboard/userDevices');
export const getDeviceLogs = (accessToken: string | null, setAccessToken: (value: string) => void, deviceData: DeviceData) => authClient(accessToken, setAccessToken).get('/dashboard/deviceLogs', { params: deviceData });
export const getDeviceShadow = (accessToken: string | null, setAccessToken: (value: string) => void, deviceData: DeviceData) => authClient(accessToken, setAccessToken).get('/dashboard/deviceShadow', { params: deviceData });
