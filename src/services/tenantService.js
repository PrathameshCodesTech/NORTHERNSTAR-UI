// src/services/tenantService.js
import axios from 'axios';

// ============================================================================
// V2 API CONFIGURATION (for Tenant Management only)
// ============================================================================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const TENANT_BASE = `${API_BASE_URL}/api/v2/admin`;

// ✅ FIXED: Changed 'token' to 'accessToken'
const getTenantAPI = () => {
  const token = localStorage.getItem('accessToken'); // ✅ Now matches login!
  return axios.create({
    baseURL: TENANT_BASE,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// ============================================================================
// SUBSCRIPTION PLAN API
// ============================================================================

export const subscriptionPlanAPI = {
  getAll: async () => {
    const api = getTenantAPI();
    const response = await api.get('/subscription-plans/');
    return response.data;
  },

  getById: async (id) => {
    const api = getTenantAPI();
    const response = await api.get(`/subscription-plans/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const api = getTenantAPI();
    const response = await api.post('/subscription-plans/', data);
    return response.data;
  },

  update: async (id, data) => {
    const api = getTenantAPI();
    const response = await api.patch(`/subscription-plans/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const api = getTenantAPI();
    const response = await api.delete(`/subscription-plans/${id}/`);
    return response.data;
  },
};

// ============================================================================
// TENANT API
// ============================================================================

export const tenantAPI = {
  getAll: async (params = {}) => {
    const api = getTenantAPI();
    const response = await api.get('/tenants/', { params });
    return response.data;
  },

  getBySlug: async (slug) => {
    const api = getTenantAPI();
    const response = await api.get(`/tenants/${slug}/`);
    return response.data;
  },

  create: async (data) => {
    const api = getTenantAPI();
    const response = await api.post('/tenants/', data);
    return response.data;
  },

  update: async (slug, data) => {
    const api = getTenantAPI();
    const response = await api.patch(`/tenants/${slug}/`, data);
    return response.data;
  },

  delete: async (slug) => {
    const api = getTenantAPI();
    const response = await api.delete(`/tenants/${slug}/`);
    return response.data;
  },

  // Custom actions
  activate: async (slug, data) => {
    const api = getTenantAPI();
    const response = await api.post(`/tenants/${slug}/activate/`, data);
    return response.data;
  },

  deletePending: async (slug) => {
    const api = getTenantAPI();
    const response = await api.delete(`/tenants/${slug}/delete_pending/`);
    return response.data;
  },

  subscribe: async (slug, data) => {
    const api = getTenantAPI();
    const response = await api.post(`/tenants/${slug}/subscribe/`, data);
    return response.data;
  },

  suspend: async (slug) => {
    const api = getTenantAPI();
    const response = await api.post(`/tenants/${slug}/suspend/`);
    return response.data;
  },

  reactivate: async (slug) => {
    const api = getTenantAPI();
    const response = await api.post(`/tenants/${slug}/reactivate/`);
    return response.data;
  },

  getUsage: async (slug) => {
    const api = getTenantAPI();
    const response = await api.get(`/tenants/${slug}/usage/`);
    return response.data;
  },

  getFrameworks: async (slug) => {
    const api = getTenantAPI();
    const response = await api.get(`/tenants/${slug}/frameworks/`);
    return response.data;
  },
};

// ============================================================================
// FRAMEWORK SUBSCRIPTION API
// ============================================================================

export const frameworkSubscriptionAPI = {
  getAll: async (params = {}) => {
    const api = getTenantAPI();
    const response = await api.get('/framework-subscriptions/', { params });
    return response.data;
  },

  getById: async (id) => {
    const api = getTenantAPI();
    const response = await api.get(`/framework-subscriptions/${id}/`);
    return response.data;
  },
};

// ============================================================================
// BILLING API
// ============================================================================

export const billingAPI = {
  getAll: async (params = {}) => {
    const api = getTenantAPI();
    const response = await api.get('/billing-history/', { params });
    return response.data;
  },

  getById: async (id) => {
    const api = getTenantAPI();
    const response = await api.get(`/billing-history/${id}/`);
    return response.data;
  },

  getPendingPayments: async () => {
    const api = getTenantAPI();
    const response = await api.get('/billing-history/pending_payments/');
    return response.data;
  },
};

// ============================================================================
// USAGE LOG API
// ============================================================================

export const usageLogAPI = {
  getAll: async (params = {}) => {
    const api = getTenantAPI();
    const response = await api.get('/usage-logs/', { params });
    return response.data;
  },

  getById: async (id) => {
    const api = getTenantAPI();
    const response = await api.get(`/usage-logs/${id}/`);
    return response.data;
  },

  getSummary: async () => {
    const api = getTenantAPI();
    const response = await api.get('/usage-logs/summary/');
    return response.data;
  },
};

// ============================================================================
// AUDIT LOG API
// ============================================================================

export const auditLogAPI = {
  getAll: async (params = {}) => {
    const api = getTenantAPI();
    const response = await api.get('/audit-logs/', { params });
    return response.data;
  },

  getById: async (id) => {
    const api = getTenantAPI();
    const response = await api.get(`/audit-logs/${id}/`);
    return response.data;
  },

  getByAdmin: async () => {
    const api = getTenantAPI();
    const response = await api.get('/audit-logs/by_admin/');
    return response.data;
  },

  getRecent: async () => {
    const api = getTenantAPI();
    const response = await api.get('/audit-logs/recent/');
    return response.data;
  },
};

// Export all
export default {
  subscriptionPlanAPI,
  tenantAPI,
  frameworkSubscriptionAPI,
  billingAPI,
  usageLogAPI,
  auditLogAPI,
};
