// src/admin/modals/CreatePlanModal.jsx
import React, { useState, useEffect } from 'react';
import '../styles/TenantManagement.css';

const CreatePlanModal = ({ isOpen, onClose, onSubmit, plan = null }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    monthly_price: '',
    annual_price: '',
    max_users: 0,
    max_frameworks: 0,
    max_controls: 0,
    storage_gb: 10,
    can_create_custom_frameworks: false,
    can_customize_controls: true,
    has_api_access: false,
    has_advanced_reporting: false,
    has_sso: false,
    default_customization_level: 'VIEW_ONLY',
    support_level: 'EMAIL',
    sort_order: 1,
    is_active: true
  });

  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes or plan changes
  useEffect(() => {
    if (!isOpen) return;

    if (plan) {
      // EDIT MODE
      setFormData({
        code: plan.code || '',
        name: plan.name || '',
        description: plan.description || '',
        monthly_price: plan.monthly_price || '',
        annual_price: plan.annual_price || '',
        max_users: plan.max_users || 0,
        max_frameworks: plan.max_frameworks || 0,
        max_controls: plan.max_controls || 0,
        storage_gb: plan.storage_gb || 10,
        can_create_custom_frameworks: plan.can_create_custom_frameworks || false,
        can_customize_controls: plan.can_customize_controls !== undefined ? plan.can_customize_controls : true,
        has_api_access: plan.has_api_access || false,
        has_advanced_reporting: plan.has_advanced_reporting || false,
        has_sso: plan.has_sso || false,
        default_customization_level: plan.default_customization_level || 'VIEW_ONLY',
        support_level: plan.support_level || 'EMAIL',
        sort_order: plan.sort_order || 1,
        is_active: plan.is_active !== undefined ? plan.is_active : true
      });
    } else {
      // CREATE MODE - Reset to defaults
      setFormData({
        code: '',
        name: '',
        description: '',
        monthly_price: '',
        annual_price: '',
        max_users: 0,
        max_frameworks: 0,
        max_controls: 0,
        storage_gb: 10,
        can_create_custom_frameworks: false,
        can_customize_controls: true,
        has_api_access: false,
        has_advanced_reporting: false,
        has_sso: false,
        default_customization_level: 'VIEW_ONLY',
        support_level: 'EMAIL',
        sort_order: 1,
        is_active: true
      });
    }

    setErrors({});
  }, [isOpen, plan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.code.trim()) newErrors.code = 'Plan code is required';
    if (!formData.name.trim()) newErrors.name = 'Plan name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.monthly_price || parseFloat(formData.monthly_price) <= 0) {
      newErrors.monthly_price = 'Valid monthly price is required';
    }
    if (!formData.annual_price || parseFloat(formData.annual_price) <= 0) {
      newErrors.annual_price = 'Valid annual price is required';
    }
    if (formData.storage_gb <= 0) {
      newErrors.storage_gb = 'Storage must be greater than 0';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for API
    const submitData = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      monthly_price: parseFloat(formData.monthly_price),
      annual_price: parseFloat(formData.annual_price),
      max_users: parseInt(formData.max_users, 10) || 0,
      max_frameworks: parseInt(formData.max_frameworks, 10) || 0,
      max_controls: parseInt(formData.max_controls, 10) || 0,
      storage_gb: parseInt(formData.storage_gb, 10),
      can_create_custom_frameworks: formData.can_create_custom_frameworks,
      can_customize_controls: formData.can_customize_controls,
      has_api_access: formData.has_api_access,
      has_advanced_reporting: formData.has_advanced_reporting,
      has_sso: formData.has_sso,
      default_customization_level: formData.default_customization_level,
      support_level: formData.support_level,
      sort_order: parseInt(formData.sort_order, 10),
      is_active: formData.is_active
    };

    onSubmit(submitData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container modal-large">
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-tag"></i>
            {plan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Basic Info */}
          <div className="form-section">
            <h3 className="form-section-title">Basic Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Plan Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  className={`form-input ${errors.code ? 'error' : ''}`}
                  placeholder="e.g., BASIC, PROFESSIONAL"
                  value={formData.code}
                  onChange={handleChange}
                  disabled={!!plan} // Can't change code when editing
                />
                {errors.code && <span className="error-text">{errors.code}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Plan Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g., Professional Plan"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe this subscription plan..."
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>

          {/* Pricing */}
          <div className="form-section">
            <h3 className="form-section-title">Pricing</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Monthly Price (USD) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="monthly_price"
                  className={`form-input ${errors.monthly_price ? 'error' : ''}`}
                  placeholder="99.00"
                  step="0.01"
                  min="0"
                  value={formData.monthly_price}
                  onChange={handleChange}
                />
                {errors.monthly_price && <span className="error-text">{errors.monthly_price}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Annual Price (USD) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="annual_price"
                  className={`form-input ${errors.annual_price ? 'error' : ''}`}
                  placeholder="999.00"
                  step="0.01"
                  min="0"
                  value={formData.annual_price}
                  onChange={handleChange}
                />
                {errors.annual_price && <span className="error-text">{errors.annual_price}</span>}
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="form-section">
            <h3 className="form-section-title">Limits</h3>
            <small className="helper-text">Set to 0 for unlimited</small>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Max Users</label>
                <input
                  type="number"
                  name="max_users"
                  className="form-input"
                  min="0"
                  value={formData.max_users}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Frameworks</label>
                <input
                  type="number"
                  name="max_frameworks"
                  className="form-input"
                  min="0"
                  value={formData.max_frameworks}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Max Controls</label>
                <input
                  type="number"
                  name="max_controls"
                  className="form-input"
                  min="0"
                  value={formData.max_controls}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Storage (GB) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="storage_gb"
                  className={`form-input ${errors.storage_gb ? 'error' : ''}`}
                  min="1"
                  value={formData.storage_gb}
                  onChange={handleChange}
                />
                {errors.storage_gb && <span className="error-text">{errors.storage_gb}</span>}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="form-section">
            <h3 className="form-section-title">Features</h3>

            <div className="checkbox-grid">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="can_create_custom_frameworks"
                  checked={formData.can_create_custom_frameworks}
                  onChange={handleChange}
                />
                <span>Create Custom Frameworks</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="can_customize_controls"
                  checked={formData.can_customize_controls}
                  onChange={handleChange}
                />
                <span>Customize Controls</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="has_api_access"
                  checked={formData.has_api_access}
                  onChange={handleChange}
                />
                <span>API Access</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="has_advanced_reporting"
                  checked={formData.has_advanced_reporting}
                  onChange={handleChange}
                />
                <span>Advanced Reporting</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="has_sso"
                  checked={formData.has_sso}
                  onChange={handleChange}
                />
                <span>Single Sign-On (SSO)</span>
              </label>
            </div>
          </div>

          {/* Settings */}
          <div className="form-section">
            <h3 className="form-section-title">Settings</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Default Customization Level</label>
                <select
                  name="default_customization_level"
                  className="form-input"
                  value={formData.default_customization_level}
                  onChange={handleChange}
                >
                  <option value="VIEW_ONLY">View Only</option>
                  <option value="CONTROL_LEVEL">Control Level</option>
                  <option value="FULL">Full Customization</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Support Level</label>
                <select
                  name="support_level"
                  className="form-input"
                  value={formData.support_level}
                  onChange={handleChange}
                >
                  <option value="EMAIL">Email Support</option>
                  <option value="PRIORITY">Priority Support</option>
                  <option value="DEDICATED">Dedicated Account Manager</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  className="form-input"
                  min="1"
                  value={formData.sort_order}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  <span>Plan is active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <i className="fas fa-check"></i>
              {plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanModal;