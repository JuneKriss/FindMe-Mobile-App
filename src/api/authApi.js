//auth-related calls
import API, { setToken } from './api';

export const login = async (username, password) => {
  const res = await API.post('auth/token/', { username, password });
  await setToken(res.data.access);
  return res.data;
};
