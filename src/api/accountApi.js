import API from './api';

export const getAccounts = () => API.get('accounts/');
export const createAccount = data => API.post('accounts/', data);
