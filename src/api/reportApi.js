import API from './api';

export const createReport = data => API.post('reports/', data);

export const uploadReportMedia = data =>
  API.post('reportMedia/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getReports = () => API.get('reports/');
// way labot own & assisted
export const getAvailableReports = () => API.get('reports/available/');

export const getReport = id => API.get(`reports/${id}/`);

export const assistReport = reportId => API.post(`reports/${reportId}/assist/`);

// Reports the volunteer is already assisting
export const getMyAssistedReports = () => API.get('reports/my_assisted/');

export const cancelReport = reportId => API.post(`reports/${reportId}/cancel/`);

export const verifyReportOtp = (reportId, code) =>
  API.post('reports/verify-report/', {
    report_id: reportId,
    code,
  });

export const resendReportOtp = reportId =>
  API.post('reports/resend-report-code/', {
    report_id: reportId,
  });
