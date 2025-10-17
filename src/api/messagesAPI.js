import API from './api';
// Messages
export const getMessages = reportId =>
  API.get(`reportMessages/?report=${reportId}`);

export const sendMessage = (reportId, text) =>
  API.post('reportMessages/', { report: reportId, text });
// Sightings
export const createSighting = data => API.post('sightings/', data);

// Upload media for a sighting
export const uploadSightingMedia = formData =>
  API.post('sightingMedia/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
// Get sightings for a specific report
export const getSightings = reportId =>
  API.get(`sightings/?report=${reportId}`);
