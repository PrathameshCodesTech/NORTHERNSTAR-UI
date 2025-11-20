// src/services/authService.js
import api from './api';

export const authAPI = {
  /**
   * Login with username and password
   * Returns JWT tokens and user info
   */
  login: async (username, password) => {
    const response = await api.post('/templates/auth/login/', {
      username,
      password,
    });
    
    // Store tokens and user info
    if (response.data.success) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * Logout - clear local storage
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * Get access token from storage
   */
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  /**
   * Get refresh token from storage
   */
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Get current user from storage
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if current user is superadmin
   */
  isSuperAdmin: () => {
    const user = authAPI.getCurrentUser();
    return user?.is_superuser === true;
  },
};

export default authAPI;
