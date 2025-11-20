// src/services/templateService.js
import api from './api';

const TEMPLATES_BASE = '/templates';

// ============================================================================
// FRAMEWORK CATEGORY API
// ============================================================================

export const frameworkCategoryAPI = {
  getAll: async () => {
    const response = await api.get(`${TEMPLATES_BASE}/framework-categories/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`${TEMPLATES_BASE}/framework-categories/`, data);
    return response.data;
  },
};

// ============================================================================
// FRAMEWORK API
// ============================================================================

export const frameworkAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TEMPLATES_BASE}/frameworks/`, { params });
    return response.data;
  },

  getById: async (id, deep = false) => {
    const params = deep ? { deep: 'true' } : {};
    const response = await api.get(`${TEMPLATES_BASE}/frameworks/${id}/`, { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`${TEMPLATES_BASE}/frameworks/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`${TEMPLATES_BASE}/frameworks/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${TEMPLATES_BASE}/frameworks/${id}/`);
    return response.data;
  },

  getDomains: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/frameworks/${id}/domains/`);
    return response.data;
  },

  getStats: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/frameworks/${id}/stats/`);
    return response.data;
  },

  validate: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/frameworks/${id}/validate/`);
    return response.data;
  },

  clone: async (id, data) => {
    const response = await api.post(`${TEMPLATES_BASE}/frameworks/${id}/clone/`, data);
    return response.data;
  },
};

// ============================================================================
// DOMAIN API
// ============================================================================

export const domainAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TEMPLATES_BASE}/domains/`, { params });
    return response.data;
  },

  getById: async (id, deep = false) => {
    const params = deep ? { deep: 'true' } : {};
    const response = await api.get(`${TEMPLATES_BASE}/domains/${id}/`, { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`${TEMPLATES_BASE}/domains/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`${TEMPLATES_BASE}/domains/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${TEMPLATES_BASE}/domains/${id}/`);
    return response.data;
  },

  getCategories: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/domains/${id}/categories/`);
    return response.data;
  },

  linkFramework: async (id, frameworkId) => {
    const response = await api.post(`${TEMPLATES_BASE}/domains/${id}/link_framework/`, {
      framework_id: frameworkId,
    });
    return response.data;
  },

  unlinkFramework: async (id) => {
    const response = await api.post(`${TEMPLATES_BASE}/domains/${id}/unlink_framework/`);
    return response.data;
  },
};

// ============================================================================
// CATEGORY API
// ============================================================================

export const categoryAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TEMPLATES_BASE}/categories/`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/categories/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`${TEMPLATES_BASE}/categories/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`${TEMPLATES_BASE}/categories/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${TEMPLATES_BASE}/categories/${id}/`);
    return response.data;
  },

  getSubcategories: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/categories/${id}/subcategories/`);
    return response.data;
  },

  linkDomain: async (id, domainId) => {
    const response = await api.post(`${TEMPLATES_BASE}/categories/${id}/link_domain/`, {
      domain_id: domainId,
    });
    return response.data;
  },

  unlinkDomain: async (id) => {
    const response = await api.post(`${TEMPLATES_BASE}/categories/${id}/unlink_domain/`);
    return response.data;
  },
};

// ============================================================================
// SUBCATEGORY API
// ============================================================================

export const subcategoryAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TEMPLATES_BASE}/subcategories/`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/subcategories/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`${TEMPLATES_BASE}/subcategories/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`${TEMPLATES_BASE}/subcategories/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${TEMPLATES_BASE}/subcategories/${id}/`);
    return response.data;
  },

  getControls: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/subcategories/${id}/controls/`);
    return response.data;
  },

  linkCategory: async (id, categoryId) => {
    const response = await api.post(`${TEMPLATES_BASE}/subcategories/${id}/link_category/`, {
      category_id: categoryId,
    });
    return response.data;
  },

  unlinkCategory: async (id) => {
    const response = await api.post(`${TEMPLATES_BASE}/subcategories/${id}/unlink_category/`);
    return response.data;
  },
};

// ============================================================================
// CONTROL API
// ============================================================================

export const controlAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TEMPLATES_BASE}/controls/`, { params });
    return response.data;
  },

  getById: async (id, deep = false) => {
    const params = deep ? { deep: 'true' } : {};
    const response = await api.get(`${TEMPLATES_BASE}/controls/${id}/`, { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`${TEMPLATES_BASE}/controls/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`${TEMPLATES_BASE}/controls/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${TEMPLATES_BASE}/controls/${id}/`);
    return response.data;
  },

  search: async (params) => {
    const response = await api.get(`${TEMPLATES_BASE}/controls/search/`, { params });
    return response.data;
  },

  getQuestions: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/controls/${id}/questions/`);
    return response.data;
  },

  getEvidence: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/controls/${id}/evidence/`);
    return response.data;
  },

  addQuestion: async (id, data) => {
    const response = await api.post(`${TEMPLATES_BASE}/controls/${id}/add_question/`, data);
    return response.data;
  },

  addEvidence: async (id, data) => {
    const response = await api.post(`${TEMPLATES_BASE}/controls/${id}/add_evidence/`, data);
    return response.data;
  },
};

// ============================================================================
// ASSESSMENT QUESTION API
// ============================================================================

export const questionAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TEMPLATES_BASE}/questions/`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/questions/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`${TEMPLATES_BASE}/questions/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`${TEMPLATES_BASE}/questions/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${TEMPLATES_BASE}/questions/${id}/`);
    return response.data;
  },
};

// ============================================================================
// EVIDENCE REQUIREMENT API
// ============================================================================

export const evidenceAPI = {
  getAll: async (params = {}) => {
    const response = await api.get(`${TEMPLATES_BASE}/evidence/`, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${TEMPLATES_BASE}/evidence/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post(`${TEMPLATES_BASE}/evidence/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`${TEMPLATES_BASE}/evidence/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${TEMPLATES_BASE}/evidence/${id}/`);
    return response.data;
  },
};

// Export all as default
export default {
  frameworkCategoryAPI,
  frameworkAPI,
  domainAPI,
  categoryAPI,
  subcategoryAPI,
  controlAPI,
  questionAPI,
  evidenceAPI,
};
