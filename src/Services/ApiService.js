import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export const loginUser = (credentials) => client.post('/users/login', credentials);

export const registerUser = (userData) => client.post('/users/register', userData);