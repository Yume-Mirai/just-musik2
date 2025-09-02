import api from './api'

export const songsAPI = {
  getAll: () => api.get('/songs'),
  getById: (id) => api.get(`/songs/${id}`),
  create: (formData) => api.post('/songs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/songs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/songs/${id}`),
  search: (query) => api.get(`/songs/search?q=${query}`),
  getStreamUrl: (id) => api.get(`/songs/${id}/stream`),
  download: (id) => api.get(`/songs/${id}/download`),
}