import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: (message, history) => api.post('/chat', { message, history }),
  confirmAction: (actionType, data, appointmentId) => 
    api.post('/chat/confirm', { actionType, data, appointmentId }),
};

export const appointmentService = {
  getAll: (filters) => api.get('/appointments', { params: filters }),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  delete: (id) => api.delete(`/appointments/${id}`),
};

export default api;
