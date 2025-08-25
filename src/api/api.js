import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.10:8000/api/', // replace with your backend IP / pc IP
  timeout: 10000,
});

// Token management
let accessToken = null;
export const setToken = token => {
  accessToken = token;
  API.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const login = async (username, password) => {
  const res = await API.post('auth/token/', { username, password });
  setToken(res.data.access);
  return res.data;
};

export default API;
