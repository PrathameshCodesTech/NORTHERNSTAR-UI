// src/services/tenantService.js
import api from './api';

const TENANT_BASE = '/admin';

// ============================================================================
// SUBSCRIPTION PLAN API
// ============================================================================

export const subscriptionPlanAPI = {
  getAll: async () => {
    const response = await api.get(`${TENANT_BASE}/subscription-plans/`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${TENANT_BASE}/subscription-plans/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`${TENANT_BASE}/subscription-plans/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`${TENANT_BASE}/subscription-plans/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${TENANT_BASE}/subscription-plans/${id}/`);
    return response.data;
  },
};

// ============================================================================
// TENANT API
// ============================================================================

export const tenantAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TENANT_BASE}/tenants/`, { params });
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await api.get(`${TENANT_BASE}/tenants/${slug}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`${TENANT_BASE}/tenants/`, data);
    return response.data;
  },

  update: async (slug, data) => {
    const response = await api.patch(`${TENANT_BASE}/tenants/${slug}/`, data);
    return response.data;
  },

  delete: async (slug) => {
    const response = await api.delete(`${TENANT_BASE}/tenants/${slug}/`);
    return response.data;
  },

  // Custom actions
  activate: async (slug, data) => {
    const response = await api.post(`${TENANT_BASE}/tenants/${slug}/activate/`, data);
    return response.data;
  },

  deletePending: async (slug) => {
    const response = await api.delete(`${TENANT_BASE}/tenants/${slug}/delete_pending/`);
    return response.data;
  },

  subscribe: async (slug, data) => {
    const response = await api.post(`${TENANT_BASE}/tenants/${slug}/subscribe/`, data);
    return response.data;
  },

  suspend: async (slug) => {
    const response = await api.post(`${TENANT_BASE}/tenants/${slug}/suspend/`);
    return response.data;
  },

  reactivate: async (slug) => {
    const response = await api.post(`${TENANT_BASE}/tenants/${slug}/reactivate/`);
    return response.data;
  },

  getUsage: async (slug) => {
    const response = await api.get(`${TENANT_BASE}/tenants/${slug}/usage/`);
    return response.data;
  },

  getFrameworks: async (slug) => {
    const response = await api.get(`${TENANT_BASE}/tenants/${slug}/frameworks/`);
    return response.data;
  },
};

// ============================================================================
// FRAMEWORK SUBSCRIPTION API
// ============================================================================

export const frameworkSubscriptionAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TENANT_BASE}/framework-subscriptions/`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${TENANT_BASE}/framework-subscriptions/${id}/`);
    return response.data;
  },
};

// ============================================================================
// BILLING API
// ============================================================================

export const billingAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TENANT_BASE}/billing-history/`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${TENANT_BASE}/billing-history/${id}/`);
    return response.data;
  },

  getPendingPayments: async () => {
    const response = await api.get(`${TENANT_BASE}/billing-history/pending_payments/`);
    return response.data;
  },
};

// ============================================================================
// USAGE LOG API
// ============================================================================

export const usageLogAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TENANT_BASE}/usage-logs/`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${TENANT_BASE}/usage-logs/${id}/`);
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get(`${TENANT_BASE}/usage-logs/summary/`);
    return response.data;
  },
};

// ============================================================================
// AUDIT LOG API
// ============================================================================

export const auditLogAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TENANT_BASE}/audit-logs/`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${TENANT_BASE}/audit-logs/${id}/`);
    return response.data;
  },

  getByAdmin: async () => {
    const response = await api.get(`${TENANT_BASE}/audit-logs/by_admin/`);
    return response.data;
  },

  getRecent: async () => {
    const response = await api.get(`${TENANT_BASE}/audit-logs/recent/`);
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