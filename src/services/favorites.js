import api from './api'

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (songId) => api.post(`/favorites/${songId}`),
  remove: (songId) => api.delete(`/favorites/${songId}`),
  check: (songId) => api.get(`/favorites/check/${songId}`),
}