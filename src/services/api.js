import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout to prevent hanging requests
  timeout: 15000, // Increased timeout for Vercel's cold starts
  // Add withCredentials for CORS
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.code === 'ECONNABORTED') {
      // Handle timeout errors
      console.error('Request timeout - server might be cold starting');
      return Promise.reject(new Error('Request timed out. Please try again.'));
    } else if (!error.response) {
      // Handle network errors
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

// Posts API calls
export const postsAPI = {
  getAllPosts: () => api.get('/posts'),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => {
    const formData = new FormData();
    Object.keys(postData).forEach(key => {
      if (key === 'image' && postData[key]) {
        formData.append('image', postData[key]);
      } else {
        formData.append(key, postData[key]);
      }
    });
    return api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updatePost: (id, postData) => {
    const formData = new FormData();
    Object.keys(postData).forEach(key => {
      if (key === 'image' && postData[key]) {
        formData.append('image', postData[key]);
      } else {
        formData.append(key, postData[key]);
      }
    });
    return api.put(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deletePost: (id) => api.delete(`/posts/${id}`)
};

// Comments API calls
export const commentsAPI = {
  getComments: (postId) => api.get(`/posts/${postId}/comments`),
  addComment: (postId, comment) => api.post(`/posts/${postId}/comments`, comment),
  updateComment: (postId, commentId, comment) => 
    api.put(`/posts/${postId}/comments/${commentId}`, comment),
  deleteComment: (postId, commentId) => 
    api.delete(`/posts/${postId}/comments/${commentId}`)
};

export default api; 