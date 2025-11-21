// src/admin/modals/SubscribeFrameworkModal.jsx
import React, { useState, useEffect } from 'react';
import '../styles/TenantManagement.css';

const SubscribeFrameworkModal = ({ isOpen, onClose, onSubmit, tenant, frameworks = [] }) => {
  const [formData, setFormData] = useState({
    framework_id: '',
    customization_level: 'CONTROL_LEVEL'
  });

  const [errors, setErrors] = useState({});
  const [selectedFramework, setSelectedFramework] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    // Reset form
    setFormData({
      framework_id: '',
      customization_level: 'CONTROL_LEVEL'
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
      customization_level: formData.customization_level
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
            <i className="fas fa-shield-halved"></i>
            Subscribe to Framework
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Tenant Info */}
          <div className="info-banner info-blue">
            <i className="fas fa-building"></i>
            <div>
              <strong>{tenant.company_name}</strong>
              <p>@{tenant.tenant_slug} | Plan: {plan.name}</p>
            </div>
          </div>

          {/* Plan Limits Check */}
          {plan.max_frameworks > 0 && (
            <div className={`info-banner ${tenant.current_framework_count >= plan.max_frameworks ? 'warning-banner' : 'info-banner'}`}>
              <i className={`fas ${tenant.current_framework_count >= plan.max_frameworks ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
              <div>
                <strong>Framework Limit</strong>
                <p>
                  Current: {tenant.current_framework_count} / {plan.max_frameworks} frameworks
                  {tenant.current_framework_count >= plan.max_frameworks && (
                    <span style={{ display: 'block', color: '#d32f2f', marginTop: '0.25rem' }}>
                      ⚠️ Limit reached! Upgrade plan to add more frameworks.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Framework Selection */}
          <div className="form-section">
            <h3 className="form-section-title">Select Framework</h3>

            <div className="form-group">
              <label className="form-label">
                Framework <span className="required">*</span>
              </label>
              <select
                name="framework_id"
                className={`form-input ${errors.framework_id ? 'error' : ''}`}
                value={formData.framework_id}
                onChange={handleChange}
                disabled={plan.max_frameworks > 0 && tenant.current_framework_count >= plan.max_frameworks}
              >
                <option value="">-- Select Framework --</option>
                {frameworks.map(framework => (
                  <option key={framework.id} value={framework.id}>
                    {framework.name} {framework.version && `(v${framework.version})`}
                  </option>
                ))}
              </select>
              {errors.framework_id && <span className="error-text">{errors.framework_id}</span>}
            </div>

            {/* Framework Preview */}
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
                <strong>Note:</strong> Customization level will be enforced based on tenant's plan ({plan.name})
              </small>
            </div>

            {/* Customization Info */}
            <div className="customization-info">
              {formData.customization_level === 'VIEW_ONLY' && (
                <div className="info-box info-gray">
                  <i className="fas fa-eye"></i>
                  <div>
                    <strong>View Only</strong>
                    <p>Tenant can view the framework but cannot make any changes.</p>
                  </div>
                </div>
              )}
              
              {formData.customization_level === 'CONTROL_LEVEL' && (
                <div className="info-box info-blue">
                  <i className="fas fa-edit"></i>
                  <div>
                    <strong>Control Level</strong>
                    <p>Full copy created. Tenant can customize control descriptions, questions, and evidence.</p>
                  </div>
                </div>
              )}
              
              {formData.customization_level === 'FULL' && (
                <div className="info-box info-purple">
                  <i className="fas fa-wand-magic-sparkles"></i>
                  <div>
                    <strong>Full Customization</strong>
                    <p>Independent copy. Tenant can modify structure and fully customize everything.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={plan.max_frameworks > 0 && tenant.current_framework_count >= plan.max_frameworks}
            >
              <i className="fas fa-plus"></i>
              Subscribe to Framework
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscribeFrameworkModal;