import API from './api';

// --- Account Endpoints ---
export const createAccount = data => API.post('accounts/', data);

// Verify Email (using user_id + code)
export const verifyEmail = async (user_id, code) => {
  const res = await API.post('accounts/verify-email/', { user_id, code });
  return res.data;
};

// Resend OTP
export const resendCode = async user_id => {
  const res = await API.post('accounts/resend-code/', { user_id });
  return res.data;
};

export const updateRole = role => API.patch('accounts/update-role/', { role });

export const getAccount = () => API.get('accounts/me/');

// --- Family Endpoint ---
export const createFamilyProfile = data => API.post('family/', data);

// --- Volunteer Endpoint ---
export const createVolunteerProfile = data => API.post('family/', data);
