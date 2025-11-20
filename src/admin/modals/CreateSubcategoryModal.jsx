// src/admin/modals/CreateSubcategoryModal.jsx
import React, { useState, useEffect } from 'react';
import './CreateFrameworkModal.css';

const CreateSubcategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  subcategory = null, 
  categories = [],
  currentCategoryId = null 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: '',
    sort_order: 1
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    if (subcategory) {
      setFormData({
        name: subcategory.name || '',
        code: subcategory.code || '',
        description: subcategory.description || '',
        category: subcategory.category || '',
        sort_order: subcategory.sort_order || 1
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        category: currentCategoryId || '',
        sort_order: 1
      });
    }

    setErrors({});

  }, [isOpen, subcategory, currentCategoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      description: formData.description.trim(),
      category: formData.category || null,
      sort_order: parseInt(formData.sort_order, 10) || 1
    };

    console.log('Submitting subcategory data:', submitData);
    
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
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-sitemap"></i>
            {subcategory ? 'Edit Subcategory' : 'Create New Subcategory'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g., User Access Management"
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
                placeholder="e.g., UAM"
                maxLength="10"
                value={formData.code}
                onChange={handleChange}
              />
              {errors.code && <span className="error-text">{errors.code}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category (Optional)</label>
              <select
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">-- Leave Unlinked --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.code})
                  </option>
                ))}
              </select>
              <small className="helper-text">
                {formData.category 
                  ? 'Subcategory will be linked to selected category' 
                  : 'Subcategory will be created as orphaned (can be linked later)'}
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

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Enter subcategory description..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <i className="fas fa-check"></i>
              {subcategory ? 'Update Subcategory' : 'Create Subcategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubcategoryModal;