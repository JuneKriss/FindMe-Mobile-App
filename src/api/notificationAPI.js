import API from './api';

export const getNotifications = async () => {
  const res = await API.get('user-notifications/');
  return res.data;
};

export const markNotificationAsRead = async id => {
  await API.post(`user-notifications/${id}/mark_read/`);
};
