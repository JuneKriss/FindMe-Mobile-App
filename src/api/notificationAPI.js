import API from './api';

// Fetch notifications, optionally filtered by reportId
export const getNotifications = async (params = {}) => {
  const res = await API.get('user-notifications/', { params });
  return res.data;
};

// Mark a single notification as read
export const markNotificationAsRead = async id => {
  await API.post(`user-notifications/${id}/mark_read/`);
};

// Get user account info
export const getAccount = () => API.get('accounts/me/');
