import React, { useState } from 'react';
import './CreateFrameworkModal.css';

const CreateFrameworkModal = ({ isOpen, onClose, onSubmit, framework = null }) => {
  const [formData, setFormData] = useState({
    name: framework?.name || '',
    full_name: framework?.full_name || '',
    version: framework?.version || '',
    description: framework?.description || '',
    status: framework?.status || 'DRAFT',
    effective_date: framework?.effective_date || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.version.trim()) newErrors.version = 'Version is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
    onClose();
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
            <i className="fas fa-folder-tree"></i>
            {framework ? 'Edit Framework' : 'Create New Framework'}
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
                placeholder="e.g., SOX, ISO27001"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Version <span className="required">*</span>
              </label>
              <input
                type="text"
                name="version"
                className={`form-input ${errors.version ? 'error' : ''}`}
                placeholder="e.g., 2024.1"
                value={formData.version}
                onChange={handleChange}
              />
              {errors.version && <span className="error-text">{errors.version}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              className={`form-input ${errors.full_name ? 'error' : ''}`}
              placeholder="e.g., Sarbanes-Oxley Act"
              value={formData.full_name}
              onChange={handleChange}
            />
            {errors.full_name && <span className="error-text">{errors.full_name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="DEPRECATED">Deprecated</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Effective Date</label>
              <input
                type="date"
                name="effective_date"
                className="form-input"
                value={formData.effective_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Enter framework description..."
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
              {framework ? 'Update Framework' : 'Create Framework'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFrameworkModal;