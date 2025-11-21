// src/admin/modals/ActivateTenantModal.jsx
import React, { useState, useEffect } from 'react';
import '../styles/TenantManagement.css';

const ActivateTenantModal = ({ isOpen, onClose, onSubmit, tenant, frameworks = [] }) => {
  const [formData, setFormData] = useState({
    framework_id: '',
    customization_level: 'CONTROL_LEVEL',
    payment_id: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedFramework, setSelectedFramework] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    // Reset form
    setFormData({
      framework_id: '',
      customization_level: 'CONTROL_LEVEL',
      payment_id: ''
    });
    setErrors({});
    setSelectedFramework(null);
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'framework_id') {
      const framework = frameworks.find(f => f.id === value);
      setSelectedFramework(framework);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.framework_id) {
      newErrors.framework_id = 'Framework is required';
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
      framework_id: formData.framework_id,
      customization_level: formData.customization_level,
      payment_id: formData.payment_id.trim() || undefined
    };

    onSubmit(submitData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !tenant) return null;

  const plan = tenant.subscription_plan || {};

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container modal-large">
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-rocket"></i>
            Activate Tenant
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Tenant Info Banner */}
          <div className="info-banner info-green">
            <i className="fas fa-check-circle"></i>
            <div>
              <strong>Activating: {tenant.company_name}</strong>
              <p>Slug: @{tenant.tenant_slug} | Plan: {plan.name}</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="info-banner info-blue">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Step 2: Activate Tenant</strong>
              <p>This will create the tenant schema/database, run migrations, and subscribe to the selected framework.</p>
            </div>
          </div>

          {/* Payment Reference */}
          <div className="form-section">
            <h3 className="form-section-title">Payment Confirmation</h3>

            <div className="form-group">
              <label className="form-label">Payment Transaction ID (Optional)</label>
              <input
                type="text"
                name="payment_id"
                className="form-input"
                placeholder="e.g., pay_abc123xyz"
                value={formData.payment_id}
                onChange={handleChange}
              />
              <small className="helper-text">
                Reference ID from payment gateway for record keeping
              </small>
            </div>
          </div>

          {/* Framework Selection */}
          <div className="form-section">
            <h3 className="form-section-title">Initial Framework</h3>

            <div className="form-group">
              <label className="form-label">
                Select Framework <span className="required">*</span>
              </label>
              <select
                name="framework_id"
                className={`form-input ${errors.framework_id ? 'error' : ''}`}
                value={formData.framework_id}
                onChange={handleChange}
              >
                <option value="">-- Select Framework --</option>
                {frameworks.map(framework => (
                  <option key={framework.id} value={framework.id}>
                    {framework.name} {framework.version && `(v${framework.version})`}
                  </option>
                ))}
              </select>
              {errors.framework_id && <span className="error-text">{errors.framework_id}</span>}
              <small className="helper-text">
                The tenant will be subscribed to this framework during activation
              </small>
            </div>

            {/* Framework Details */}
            {selectedFramework && (
              <div className="framework-preview">
                <div className="framework-preview-header">
                  <h4>{selectedFramework.name}</h4>
                  {selectedFramework.version && (
                    <span className="framework-version">v{selectedFramework.version}</span>
                  )}
                </div>
                <p className="framework-description">{selectedFramework.description}</p>
                
                {selectedFramework.total_controls > 0 && (
                  <div className="framework-stats">
                    <div className="framework-stat">
                      <i className="fas fa-list-check"></i>
                      <span>{selectedFramework.total_controls} Controls</span>
                    </div>
                    {selectedFramework.total_domains > 0 && (
                      <div className="framework-stat">
                        <i className="fas fa-layer-group"></i>
                        <span>{selectedFramework.total_domains} Domains</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Customization Level */}
          <div className="form-section">
            <h3 className="form-section-title">Customization Level</h3>

            <div className="form-group">
              <label className="form-label">Customization Level</label>
              <select
                name="customization_level"
                className="form-input"
                value={formData.customization_level}
                onChange={handleChange}
              >
                <option value="VIEW_ONLY">View Only (No Customization)</option>
                <option value="CONTROL_LEVEL">Control Level (Can Customize Controls)</option>
                <option value="FULL">Full (Complete Customization)</option>
              </select>
              <small className="helper-text">
                <strong>Note:</strong> This may be enforced based on the tenant's subscription plan ({plan.name})
              </small>
            </div>

            {/* Customization Level Info */}
            <div className="customization-info">
              {formData.customization_level === 'VIEW_ONLY' && (
                <div className="info-box info-gray">
                  <i className="fas fa-eye"></i>
                  <div>
                    <strong>View Only</strong>
                    <p>Tenant can view the framework but cannot make any changes. Framework remains linked to template.</p>
                  </div>
                </div>
              )}
              
              {formData.customization_level === 'CONTROL_LEVEL' && (
                <div className="info-box info-blue">
                  <i className="fas fa-edit"></i>
                  <div>
                    <strong>Control Level</strong>
                    <p>Full framework copy created. Tenant can customize control descriptions, questions, and evidence requirements.</p>
                  </div>
                </div>
              )}
              
              {formData.customization_level === 'FULL' && (
                <div className="info-box info-purple">
                  <i className="fas fa-wand-magic-sparkles"></i>
                  <div>
                    <strong>Full Customization</strong>
                    <p>Complete independent copy. Tenant can modify structure, add/remove controls, and fully customize everything.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Plan Limits Warning */}
          {plan.max_frameworks > 0 && (
            <div className="info-banner warning-banner">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <strong>Plan Limits</strong>
                <p>This plan allows up to {plan.max_frameworks} framework(s). Current: 0</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit btn-success">
              <i className="fas fa-rocket"></i>
              Activate Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivateTenantModal;