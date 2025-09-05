import API from './api';

export const createReport = data =>
  API.post('reports/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getReports = () => API.get('reports/');
export const getReport = id => API.get(`reports/${id}/`);
