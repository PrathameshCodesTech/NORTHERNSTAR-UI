// src/admin/modals/ActivateTenantModal.jsx
import React, { useState, useEffect } from 'react';
import '../styles/TenantManagement.css';

const ActivateTenantModal = ({ isOpen, onClose, onSubmit, tenant, frameworks = [] }) => {
  const [formData, setFormData] = useState({
    framework_ids: [], // ✅ CHANGED: Now array of IDs
    customization_level: 'CONTROL_LEVEL',
    payment_id: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);

useEffect(() => {
    if (!isOpen || !tenant) return;

    // ✅ Try to get requested frameworks from tenant OR sessionStorage
    let requestedFrameworks = tenant.requested_frameworks || [];
    
    // Fallback: If tenant doesn't have requested_frameworks, try sessionStorage
    if (!requestedFrameworks || requestedFrameworks.length === 0) {
      try {
        const storedFrameworks = sessionStorage.getItem('requested_frameworks');
        if (storedFrameworks) {
          requestedFrameworks = JSON.parse(storedFrameworks);
          console.log('📦 Loaded requested frameworks from sessionStorage:', requestedFrameworks);
        }
      } catch (err) {
        console.warn('⚠️ Failed to parse requested_frameworks from sessionStorage:', err);
      }
    }

    console.log('🎯 Final requested frameworks:', requestedFrameworks);
    
    const requestedIds = requestedFrameworks.map(f => f.id);
    
    // Reset form
    setFormData({
      framework_ids: requestedIds, // ✅ Pre-populate with requested
      customization_level: 'CONTROL_LEVEL',
      payment_id: ''
    });
    setErrors({});
    
    // ✅ Set selected frameworks for display
    const preSelected = frameworks.filter(f => requestedIds.includes(f.id));
    setSelectedFrameworks(preSelected);
    
    console.log('✅ Pre-selected frameworks:', preSelected);
  }, [isOpen, tenant, frameworks]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ NEW: Handle framework checkbox toggle
  const handleFrameworkToggle = (frameworkId) => {
    setFormData(prev => {
      const isSelected = prev.framework_ids.includes(frameworkId);

      const newIds = isSelected
        ? prev.framework_ids.filter(id => id !== frameworkId)
        : [...prev.framework_ids, frameworkId];

      return { ...prev, framework_ids: newIds };
    });

    // Update selected frameworks for display
    const framework = frameworks.find(f => f.id === frameworkId);
    if (framework) {
      setSelectedFrameworks(prev => {
        const isSelected = prev.some(f => f.id === frameworkId);
        return isSelected
          ? prev.filter(f => f.id !== frameworkId)
          : [...prev, framework];
      });
    }

    if (errors.framework_ids) {
      setErrors(prev => ({ ...prev, framework_ids: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.framework_ids || formData.framework_ids.length === 0) {
      newErrors.framework_ids = 'At least one framework is required'; // ✅ CHANGED
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
      framework_ids: formData.framework_ids,
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
            <h3 className="form-section-title">Select Frameworks</h3>

            {/* Show requested frameworks notice */}
            {tenant?.requested_frameworks && tenant.requested_frameworks.length > 0 && (
              <div className="info-banner info-blue" style={{ marginBottom: '16px' }}>
                <i className="fas fa-info-circle"></i>
                <div>
                  <strong>Requested Frameworks Pre-Selected</strong>
                  <p>The user requested {tenant.requested_frameworks.length} framework(s). You can add or remove as needed.</p>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Select Frameworks <span className="required">*</span>
              </label>

              {/* Framework Checkboxes */}
              <div className="framework-checkboxes">
                {frameworks.map(framework => (
                  <label key={framework.id} className="framework-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.framework_ids.includes(framework.id)}
                      onChange={() => handleFrameworkToggle(framework.id)}
                      className="framework-checkbox-input"
                    />
                    <div className="framework-checkbox-content">
                      <div className="framework-checkbox-header">
                        <span className="framework-checkbox-name">{framework.name}</span>
                        {framework.version && (
                          <span className="framework-checkbox-version">v{framework.version}</span>
                        )}
                      </div>
                      {framework.description && (
                        <p className="framework-checkbox-description">{framework.description}</p>
                      )}
                      {framework.total_controls > 0 && (
                        <div className="framework-checkbox-stats">
                          <span><i className="fas fa-list-check"></i> {framework.total_controls} Controls</span>
                          {framework.total_domains > 0 && (
                            <span><i className="fas fa-layer-group"></i> {framework.total_domains} Domains</span>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {errors.framework_ids && <span className="error-text">{errors.framework_ids}</span>}

              <small className="helper-text">
                Select one or more frameworks. The tenant will be subscribed to all selected frameworks during activation.
              </small>
            </div>

            {/* Selected Frameworks Summary */}
            {selectedFrameworks.length > 0 && (
              <div className="selected-frameworks-summary">
                <h4>Selected Frameworks ({selectedFrameworks.length})</h4>
                <div className="selected-frameworks-list">
                  {selectedFrameworks.map(framework => (
                    <span key={framework.id} className="selected-framework-tag">
                      <i className="fas fa-check-circle"></i>
                      {framework.name}
                    </span>
                  ))}
                </div>
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