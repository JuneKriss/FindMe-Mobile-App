import API from './api';

export const getAccounts = () => API.get('accounts/');
export const createAccount = data => API.post('accounts/', data);
export const updateRole = role => API.patch('accounts/update-role/', { role });
export const getMe = () => API.get('accounts/me/');
