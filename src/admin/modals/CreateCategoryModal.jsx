// src/admin/modals/CreateCategoryModal.jsx
import React, { useState, useEffect } from 'react';
import './CreateFrameworkModal.css';

const CreateCategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  category = null, 
  domains = [],
  currentDomainId = null 
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    domain: '', // ✅ FIXED: Changed from domain_id to domain
    sort_order: 1
  });

  const [errors, setErrors] = useState({});

  // ============================================================================
  // RESET FORM WHEN MODAL OPENS/CLOSES OR CATEGORY CHANGES
  // ============================================================================
  useEffect(() => {
    if (!isOpen) return;

    if (category) {
      // ✅ EDIT MODE - Pre-fill form
      setFormData({
        name: category.name || '',
        code: category.code || '',
        description: category.description || '',
        domain: category.domain || '', // ✅ FIXED: Use category.domain (UUID)
        sort_order: category.sort_order || 1
      });
    } else {
      // ✅ CREATE MODE - Reset form, pre-select current domain if available
      setFormData({
        name: '',
        code: '',
        description: '',
        domain: currentDomainId || '', // ✅ Pre-select current domain
        sort_order: 1
      });
    }

    // Clear errors
    setErrors({});

  }, [isOpen, category, currentDomainId]);

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

    // ✅ FIXED: Prepare data for API
    const submitData = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      description: formData.description.trim(),
      domain: formData.domain || null, // ✅ Send null if empty (orphaned category)
      sort_order: parseInt(formData.sort_order, 10) || 1
    };

    console.log('Submitting category data:', submitData);
    
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
            <i className="fas fa-tags"></i>
            {category ? 'Edit Category' : 'Create New Category'}
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
                placeholder="e.g., Access Controls"
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
                placeholder="e.g., AC"
                maxLength="10"
                value={formData.code}
                onChange={handleChange}
              />
              {errors.code && <span className="error-text">{errors.code}</span>}
            </div>
          </div>

          {/* DOMAIN & SORT ORDER */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Domain (Optional)</label>
              <select
                name="domain" // ✅ FIXED: Changed from domain_id to domain
                className="form-input"
                value={formData.domain}
                onChange={handleChange}
              >
                <option value="">-- Leave Unlinked --</option>
                {domains.map(domain => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name} ({domain.code})
                  </option>
                ))}
              </select>
              {/* ✅ NEW: Helper text */}
              <small className="helper-text">
                {formData.domain 
                  ? 'Category will be linked to selected domain' 
                  : 'Category will be created as orphaned (can be linked later)'}
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
              placeholder="Enter category description..."
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
              {category ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryModal;