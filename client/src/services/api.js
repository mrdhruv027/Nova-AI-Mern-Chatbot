import axios from 'axios';

const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://nova-ai-mern-chatbot-1.onrender.com/api';
  if (url.endsWith('/')) url = url.slice(0, -1);
  if (!url.endsWith('/api')) url += '/api';
  return url;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('nova_token');
      localStorage.removeItem('nova_user');
    }
    return Promise.reject(new Error(message));
  }
);

// API Service Call Wrappers
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const chatAPI = {
  getChats: (search = '') => api.get(`/chats${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createChat: (data) => api.post('/chats', data),
  getChatById: (id) => api.get(`/chats/${id}`),
  updateTitle: (id, title) => api.put(`/chats/${id}`, { title }),
  togglePin: (id) => api.patch(`/chats/${id}/pin`),
  toggleFavorite: (id) => api.patch(`/chats/${id}/favorite`),
  deleteChat: (id) => api.delete(`/chats/${id}`),
};

export const uploadAPI = {
  getImageKitAuth: () => api.get('/upload/imagekit-auth'),
  uploadImage: (fileBase64, fileName) => api.post('/upload/image', { fileBase64, fileName }),
};

export default api;
