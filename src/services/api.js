// src/services/api.js
import axios from 'axios';

// Base API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Get JWT access token from localStorage
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('Unauthorized. Please login.');
          localStorage.clear();
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden - no permission
          console.error('Forbidden. You do not have permission.');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found.');
          break;
          
        case 500:
          // Server error
          console.error('Server error. Please try again later.');
          break;
          
        default:
          console.error('An error occurred:', data?.message || error.message);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
