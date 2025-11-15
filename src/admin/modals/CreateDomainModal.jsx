import React, { useState } from 'react';
import './CreateFrameworkModal.css';

const CreateDomainModal = ({ isOpen, onClose, onSubmit, domain = null, frameworks = [] }) => {
  const [formData, setFormData] = useState({
    name: domain?.name || '',
    code: domain?.code || '',
    description: domain?.description || '',
    framework_id: domain?.framework_id || '',
    sort_order: domain?.sort_order || 1
  });

  const [errors, setErrors] = useState({});

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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.code.trim()) newErrors.code = 'Code is required';
    if (formData.code.length > 10) newErrors.code = 'Code must be 10 characters or less';
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
            <i className="fas fa-layer-group"></i>
            {domain ? 'Edit Domain' : 'Create New Domain'}
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Framework (Optional)</label>
              <select
                name="framework_id"
                className="form-input"
                value={formData.framework_id}
                onChange={handleChange}
              >
                <option value="">-- Select Framework --</option>
                {frameworks.map(fw => (
                  <option key={fw.id} value={fw.id}>
                    {fw.name} v{fw.version}
                  </option>
                ))}
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