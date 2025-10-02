import API from './api';

// Create report (without photos)
export const createReport = data => API.post('reports/', data);

// Upload photos separately
export const uploadReportMedia = data =>
  API.post('reportMedia/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getReports = () => API.get('reports/');
export const getReport = id => API.get(`reports/${id}/`);
