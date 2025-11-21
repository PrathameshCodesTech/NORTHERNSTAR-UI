// src/admin/modals/CreateTenantModal.jsx
import React, { useState, useEffect } from 'react';
import '../styles/TenantManagement.css';

const CreateTenantModal = ({ isOpen, onClose, onSubmit, plans = [] }) => {
  const [formData, setFormData] = useState({
    tenant_slug: '',
    company_name: '',
    company_email: '',
    company_phone: '',
    subscription_plan_code: 'BASIC'
  });

  const [errors, setErrors] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    // Reset form
    setFormData({
      tenant_slug: '',
      company_name: '',
      company_email: '',
      company_phone: '',
      subscription_plan_code: 'BASIC'
    });
    setErrors({});

    // Set default selected plan
    if (plans.length > 0) {
      const defaultPlan = plans.find(p => p.code === 'BASIC') || plans[0];
      setSelectedPlan(defaultPlan);
      setFormData(prev => ({ ...prev, subscription_plan_code: defaultPlan.code }));
    }
  }, [isOpen, plans]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from company name
    if (name === 'company_name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
      
      setFormData(prev => ({
        ...prev,
        company_name: value,
        tenant_slug: slug
      }));
    } else if (name === 'subscription_plan_code') {
      const plan = plans.find(p => p.code === value);
      setSelectedPlan(plan);
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.tenant_slug.trim()) {
      newErrors.tenant_slug = 'Tenant slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.tenant_slug)) {
      newErrors.tenant_slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    } else if (formData.tenant_slug.length < 3) {
      newErrors.tenant_slug = 'Slug must be at least 3 characters';
    }

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    } else if (formData.company_name.trim().length < 2) {
      newErrors.company_name = 'Company name must be at least 2 characters';
    }

    if (!formData.company_email.trim()) {
      newErrors.company_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.company_email)) {
      newErrors.company_email = 'Invalid email format';
    }

    if (!formData.subscription_plan_code) {
      newErrors.subscription_plan_code = 'Subscription plan is required';
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

    const submitData = {
      tenant_slug: formData.tenant_slug.trim(),
      company_name: formData.company_name.trim(),
      company_email: formData.company_email.trim(),
      company_phone: formData.company_phone.trim(),
      subscription_plan_code: formData.subscription_plan_code
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
            <i className="fas fa-building"></i>
            Create New Tenant
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Info Banner */}
          <div className="info-banner info-blue">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Step 1: Create Tenant Record</strong>
              <p>This creates a pending tenant record. After payment confirmation, you can activate the tenant.</p>
            </div>
          </div>

          {/* Company Info */}
          <div className="form-section">
            <h3 className="form-section-title">Company Information</h3>

            <div className="form-group">
              <label className="form-label">
                Company Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="company_name"
                className={`form-input ${errors.company_name ? 'error' : ''}`}
                placeholder="e.g., Acme Corporation"
                value={formData.company_name}
                onChange={handleChange}
              />
              {errors.company_name && <span className="error-text">{errors.company_name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Tenant Slug <span className="required">*</span>
              </label>
              <input
                type="text"
                name="tenant_slug"
                className={`form-input ${errors.tenant_slug ? 'error' : ''}`}
                placeholder="e.g., acmecorp"
                value={formData.tenant_slug}
                onChange={handleChange}
              />
              {errors.tenant_slug && <span className="error-text">{errors.tenant_slug}</span>}
              <small className="helper-text">
                Lowercase letters, numbers, and hyphens only. This will be used in URLs.
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Company Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="company_email"
                  className={`form-input ${errors.company_email ? 'error' : ''}`}
                  placeholder="admin@acmecorp.com"
                  value={formData.company_email}
                  onChange={handleChange}
                />
                {errors.company_email && <span className="error-text">{errors.company_email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Company Phone</label>
                <input
                  type="tel"
                  name="company_phone"
                  className="form-input"
                  placeholder="+1 (555) 123-4567"
                  value={formData.company_phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Subscription Plan */}
          <div className="form-section">
            <h3 className="form-section-title">Subscription Plan</h3>

            <div className="form-group">
              <label className="form-label">
                Select Plan <span className="required">*</span>
              </label>
              <select
                name="subscription_plan_code"
                className={`form-input ${errors.subscription_plan_code ? 'error' : ''}`}
                value={formData.subscription_plan_code}
                onChange={handleChange}
              >
                <option value="">-- Select Plan --</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.code}>
                    {plan.name} - ${plan.monthly_price}/mo
                  </option>
                ))}
              </select>
              {errors.subscription_plan_code && (
                <span className="error-text">{errors.subscription_plan_code}</span>
              )}
            </div>

            {/* Plan Details */}
            {selectedPlan && (
              <div className="plan-preview">
                <div className="plan-preview-header">
                  <h4>{selectedPlan.name}</h4>
                  <span className="plan-preview-price">
                    ${selectedPlan.monthly_price}/mo
                  </span>
                </div>
                <p className="plan-preview-description">{selectedPlan.description}</p>
                
                <div className="plan-preview-limits">
                  <div className="preview-limit">
                    <i className="fas fa-users"></i>
                    <span>Users: {selectedPlan.max_users === 0 ? 'Unlimited' : selectedPlan.max_users}</span>
                  </div>
                  <div className="preview-limit">
                    <i className="fas fa-shield-halved"></i>
                    <span>Frameworks: {selectedPlan.max_frameworks === 0 ? 'Unlimited' : selectedPlan.max_frameworks}</span>
                  </div>
                  <div className="preview-limit">
                    <i className="fas fa-database"></i>
                    <span>Storage: {selectedPlan.storage_gb} GB</span>
                  </div>
                </div>

                {selectedPlan.features && selectedPlan.features.length > 0 && (
                  <div className="plan-preview-features">
                    <strong>Included Features:</strong>
                    <ul>
                      {selectedPlan.features.map((feature, idx) => (
                        <li key={idx}>
                          <i className="fas fa-check"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <i className="fas fa-building"></i>
              Create Tenant Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTenantModal;