// src/admin/modals/CreateControlModal.jsx
import React, { useState, useEffect } from 'react';
import './CreateFrameworkModal.css';

const CreateControlModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  control = null, 
  subcategories = [],
  currentSubcategoryId = null 
}) => {
  const [formData, setFormData] = useState({
    control_code: '',
    title: '',
    description: '',
    objective: '',
    control_type: 'PREVENTIVE',
    frequency: 'MONTHLY',
    risk_level: 'MEDIUM',
    subcategory: '', // ✅ Changed from subcategory_id to subcategory
    sort_order: 1
  });

  const [errors, setErrors] = useState({});

  // ✅ Reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (control) {
      // EDIT MODE
      setFormData({
        control_code: control.control_code || '',
        title: control.title || '',
        description: control.description || '',
        objective: control.objective || '',
        control_type: control.control_type || 'PREVENTIVE',
        frequency: control.frequency || 'MONTHLY',
        risk_level: control.risk_level || 'MEDIUM',
        subcategory: control.subcategory || '',
        sort_order: control.sort_order || 1
      });
    } else {
      // CREATE MODE
      setFormData({
        control_code: '',
        title: '',
        description: '',
        objective: '',
        control_type: 'PREVENTIVE',
        frequency: 'MONTHLY',
        risk_level: 'MEDIUM',
        subcategory: currentSubcategoryId || '', // ✅ Pre-select current subcategory
        sort_order: 1
      });
    }

    setErrors({});

  }, [isOpen, control, currentSubcategoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'control_code' ? value.toUpperCase() : value
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
    
    if (!formData.control_code.trim()) {
      newErrors.control_code = 'Control code is required';
    } else {
      const codePattern = /^[A-Z]{2,4}-\d{3}$/;
      if (!codePattern.test(formData.control_code)) {
        newErrors.control_code = 'Format must be like AC-001, CM-001';
      }
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.objective.trim()) {
      newErrors.objective = 'Objective is required';
    }
    
    // ✅ NEW: Subcategory is REQUIRED
    if (!formData.subcategory) {
      newErrors.subcategory = 'Subcategory is required';
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

    // ✅ Prepare data for API
    const submitData = {
      control_code: formData.control_code.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      objective: formData.objective.trim(),
      control_type: formData.control_type,
      frequency: formData.frequency,
      risk_level: formData.risk_level,
      subcategory: formData.subcategory, // ✅ Always required (UUID)
      sort_order: parseInt(formData.sort_order, 10) || 1
    };

    console.log('Submitting control data:', submitData);
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
            <i className="fas fa-shield-halved"></i>
            {control ? 'Edit Control' : 'Create New Control'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* CONTROL CODE & SUBCATEGORY */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Control Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="control_code"
                className={`form-input ${errors.control_code ? 'error' : ''}`}
                placeholder="e.g., AC-001, CM-001"
                value={formData.control_code}
                onChange={handleChange}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.control_code && <span className="error-text">{errors.control_code}</span>}
              <small className="helper-text">Format: 2-4 letters, dash, 3 digits</small>
            </div>

            <div className="form-group">
              <label className="form-label">
                Subcategory <span className="required">*</span>
              </label>
              <select
                name="subcategory"
                className={`form-input ${errors.subcategory ? 'error' : ''}`}
                value={formData.subcategory}
                onChange={handleChange}
              >
                <option value="">-- Select Subcategory --</option>
                {subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
              {errors.subcategory && <span className="error-text">{errors.subcategory}</span>}
              <small className="helper-text">Control must belong to a subcategory</small>
            </div>
          </div>

          {/* TITLE */}
          <div className="form-group">
            <label className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g., User Account Creation Process"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              name="description"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Describe what this control does..."
              rows="3"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          {/* OBJECTIVE */}
          <div className="form-group">
            <label className="form-label">
              Objective <span className="required">*</span>
            </label>
            <textarea
              name="objective"
              className={`form-textarea ${errors.objective ? 'error' : ''}`}
              placeholder="What this control aims to achieve..."
              rows="3"
              value={formData.objective}
              onChange={handleChange}
            ></textarea>
            {errors.objective && <span className="error-text">{errors.objective}</span>}
          </div>

          {/* CONTROL TYPE & FREQUENCY */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Control Type <span className="required">*</span>
              </label>
              <select
                name="control_type"
                className="form-input"
                value={formData.control_type}
                onChange={handleChange}
              >
                <option value="PREVENTIVE">Preventive</option>
                <option value="DETECTIVE">Detective</option>
                <option value="CORRECTIVE">Corrective</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Frequency <span className="required">*</span>
              </label>
              <select
                name="frequency"
                className="form-input"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="CONTINUOUS">Continuous</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="ANNUALLY">Annually</option>
              </select>
            </div>
          </div>

          {/* RISK LEVEL & SORT ORDER */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Risk Level <span className="required">*</span>
              </label>
              <select
                name="risk_level"
                className="form-input"
                value={formData.risk_level}
                onChange={handleChange}
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
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

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <i className="fas fa-check"></i>
              {control ? 'Update Control' : 'Create Control'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateControlModal;