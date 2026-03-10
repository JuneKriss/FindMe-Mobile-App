import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://10.243.213.138:8000/api/',
  timeout: 10000,
});

// Set token for API requests
export const setToken = async token => {
  await AsyncStorage.setItem('accessToken', token);
  API.defaults.headers.common.Authorization = `Bearer ${token}`;
};

// Load token on app start
export const loadToken = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log('Token loaded into API headers:', token);
  }
  return token;
};

export default API;
