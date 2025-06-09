import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Posts API calls
export const postsAPI = {
  getAllPosts: async () => {
    const response = await api.get('/posts');
    return response.data;
  },
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  createPost: async (postData) => {
    const formData = new FormData();
    Object.keys(postData).forEach(key => {
      if (key === 'image' && postData[key] instanceof File) {
        formData.append('image', postData[key]);
      } else {
        formData.append(key, postData[key]);
      }
    });
    
    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  updatePost: async (id, postData) => {
    const formData = new FormData();
    Object.keys(postData).forEach(key => {
      if (key === 'image' && postData[key] instanceof File) {
        formData.append('image', postData[key]);
      } else {
        formData.append(key, postData[key]);
      }
    });
    
    const response = await api.put(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  }
}; 