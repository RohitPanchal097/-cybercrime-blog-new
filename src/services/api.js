import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

const firebaseConfig = {
  apiKey: "AIzaSyCnxoEAyOErwywVp0CYnRKGNY4FO7k2v5Y",
  authDomain: "cybercel-62531.firebaseapp.com",
  projectId: "cybercel-62531",
  storageBucket: "cybercel-62531.appspot.com",
  messagingSenderId: "851391911380",
  appId: "1:851391911380:web:dd38a0ce110b96a4b37241",
  measurementId: "G-DBPF6VY6D4"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Add timeout to prevent hanging requests
  timeout: 30000, // Increased timeout for Vercel's cold starts
  // Remove withCredentials as it's causing CORS issues
  withCredentials: false
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add cache control headers
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
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
      // Handle timeout errors (common with Vercel's cold starts)
      console.error('Request timeout - server might be cold starting');
      return Promise.reject(new Error('The server is starting up. Please try again in a few seconds.'));
    } else if (!error.response) {
      // Handle network errors
      console.error('Network error:', error);
      if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
        return Promise.reject(new Error('Unable to connect to the server. Please try again later.'));
      }
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    } else if (error.response?.status === 503) {
      // Handle Vercel's cold start
      console.error('Service temporarily unavailable - cold start');
      return Promise.reject(new Error('The server is starting up. Please try again in a few seconds.'));
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
  createPost: async (postData) => {
    let imageUrl = postData.image;
    if (postData.image && postData.image instanceof File) {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `uploads/${Date.now()}-${postData.image.name}`);
      await uploadBytes(storageRef, postData.image);
      imageUrl = await getDownloadURL(storageRef);
    }
    // Send postData with imageUrl instead of file
    const payload = { ...postData, image: imageUrl };
    return api.post('/posts', payload);
  },
  updatePost: async (id, postData) => {
    let imageUrl = postData.image;
    if (postData.image && postData.image instanceof File) {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `uploads/${Date.now()}-${postData.image.name}`);
      await uploadBytes(storageRef, postData.image);
      imageUrl = await getDownloadURL(storageRef);
    }
    // Send postData with imageUrl instead of file
    const payload = { ...postData, image: imageUrl };
    return api.put(`/posts/${id}`, payload);
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