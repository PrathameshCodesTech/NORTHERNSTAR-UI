import React, { useState } from 'react';
import './CreateFrameworkModal.css';

const AddEvidenceModal = ({ isOpen, onClose, onSubmit, evidence = null, controlCode = '' }) => {
  const [formData, setFormData] = useState({
    title: evidence?.title || '',
    description: evidence?.description || '',
    evidence_type: evidence?.evidence_type || 'DOCUMENT',
    file_format: evidence?.file_format || '',
    is_mandatory: evidence?.is_mandatory !== undefined ? evidence.is_mandatory : true,
    sort_order: evidence?.sort_order || 1
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
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
            <i className="fas fa-file-lines"></i>
            {evidence ? 'Edit Evidence Requirement' : 'Add Evidence Requirement'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {controlCode && (
            <div className="info-banner">
              <i className="fas fa-shield-halved"></i>
              <span>Adding evidence to control: <strong>{controlCode}</strong></span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g., User Access Request Form"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              name="description"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Describe the evidence requirement..."
              rows="3"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Evidence Type <span className="required">*</span>
              </label>
              <select
                name="evidence_type"
                className="form-input"
                value={formData.evidence_type}
                onChange={handleChange}
              >
                <option value="DOCUMENT">Document</option>
                <option value="SCREENSHOT">Screenshot</option>
                <option value="VIDEO">Video</option>
                <option value="LOG_FILE">Log File</option>
                <option value="REPORT">Report</option>
                <option value="POLICY">Policy</option>
                <option value="PROCEDURE">Procedure</option>
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
            <label className="form-label">Accepted File Formats</label>
            <input
              type="text"
              name="file_format"
              className="form-input"
              placeholder="e.g., PDF, DOC, XLSX"
              value={formData.file_format}
              onChange={handleChange}
            />
            <span className="helper-text">Comma-separated list of file formats</span>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_mandatory"
                checked={formData.is_mandatory}
                onChange={handleChange}
              />
              <span>This is a mandatory evidence</span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <i className="fas fa-check"></i>
              {evidence ? 'Update Evidence' : 'Add Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvidenceModal;