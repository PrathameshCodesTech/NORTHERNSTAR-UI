// src/admin/modals/CreateDomainModal.jsx
import React, { useState, useEffect } from 'react';
import { frameworkAPI } from '../../services/templateService';
import './CreateFrameworkModal.css';

const CreateDomainModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  domain = null, 
  currentFrameworkId = null 
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    framework: '', // ✅ Changed from framework_id to framework (backend expects this)
    sort_order: 1
  });

  const [errors, setErrors] = useState({});
  const [frameworks, setFrameworks] = useState([]);
  const [loadingFrameworks, setLoadingFrameworks] = useState(false);

  // ============================================================================
  // FETCH FRAMEWORKS WHEN MODAL OPENS
  // ============================================================================
  useEffect(() => {
    if (!isOpen) return;

    // Fetch frameworks for dropdown
    fetchFrameworks();

    // Reset or populate form based on mode
    if (domain) {
      // EDIT MODE - Pre-fill form
      setFormData({
        name: domain.name || '',
        code: domain.code || '',
        description: domain.description || '',
        framework: domain.framework || '', // ✅ Use domain.framework (UUID)
        sort_order: domain.sort_order || 1
      });
    } else {
      // CREATE MODE - Reset form, pre-select current framework
      setFormData({
        name: '',
        code: '',
        description: '',
        framework: currentFrameworkId || '', // ✅ Pre-select current framework
        sort_order: 1
      });
    }

    // Clear errors
    setErrors({});

  }, [isOpen, domain, currentFrameworkId]);

  // ============================================================================
  // FETCH FRAMEWORKS FOR DROPDOWN
  // ============================================================================
  const fetchFrameworks = async () => {
    try {
      setLoadingFrameworks(true);
      const data = await frameworkAPI.getAll();
      const frameworksArray = Array.isArray(data) ? data : data?.results || [];
      setFrameworks(frameworksArray);
    } catch (err) {
      console.error('Error fetching frameworks:', err);
      setFrameworks([]);
    } finally {
      setLoadingFrameworks(false);
    }
  };

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // ============================================================================
  // VALIDATION
  // ============================================================================
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }
    
    if (formData.code.length > 10) {
      newErrors.code = 'Code must be 10 characters or less';
    }
    
    return newErrors;
  };

  // ============================================================================
  // SUBMIT HANDLER
  // ============================================================================
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for API
    const submitData = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      description: formData.description.trim(),
      framework: formData.framework || null, // ✅ Send null if empty (orphaned domain)
      sort_order: parseInt(formData.sort_order, 10) || 1
    };

    console.log('Submitting domain data:', submitData);
    
    // Pass to parent
    onSubmit(submitData);
  };

  // ============================================================================
  // BACKDROP CLICK HANDLER
  // ============================================================================
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ============================================================================
  // RENDER NOTHING IF CLOSED
  // ============================================================================
  if (!isOpen) return null;

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-layer-group"></i>
            {domain ? 'Edit Domain' : 'Create New Domain'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* NAME & CODE */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g., IT General Controls"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="code"
                className={`form-input ${errors.code ? 'error' : ''}`}
                placeholder="e.g., ITGC"
                maxLength="10"
                value={formData.code}
                onChange={handleChange}
              />
              {errors.code && <span className="error-text">{errors.code}</span>}
            </div>
          </div>

          {/* FRAMEWORK & SORT ORDER */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Framework (Optional)</label>
              <select
                name="framework"
                className="form-input"
                value={formData.framework}
                onChange={handleChange}
                disabled={loadingFrameworks}
              >
                <option value="">-- Leave Unlinked --</option>
                {frameworks.map(fw => (
                  <option key={fw.id} value={fw.id}>
                    {fw.name} v{fw.version}
                  </option>
                ))}
              </select>
              <small className="helper-text">
                {formData.framework 
                  ? 'Domain will be linked to selected framework' 
                  : 'Domain will be created as orphaned (can be linked later)'}
              </small>
            </div>

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
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Enter domain description..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <i className="fas fa-check"></i>
              {domain ? 'Update Domain' : 'Create Domain'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDomainModal;