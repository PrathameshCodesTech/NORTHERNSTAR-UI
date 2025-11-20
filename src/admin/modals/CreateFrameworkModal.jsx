import React, { useState, useEffect } from 'react';
import { frameworkCategoryAPI } from '../../services/templateService'; // For categories
import { frameworkAPI } from '../../services/templateService'; // For superseded framework options
import './CreateFrameworkModal.css';

const CreateFrameworkModal = ({ isOpen, onClose, onSubmit, framework = null }) => {
  // Initialize form data with either framework values (edit mode) or empty defaults (create mode)
  const [formData, setFormData] = useState({
    name: framework?.name || '',
    full_name: framework?.full_name || '',
    version: framework?.version || '',
    description: framework?.description || '',
    status: framework?.status || 'DRAFT',
    effective_date: framework?.effective_date || '',
    category: framework?.category?.id || '',

    applicable_industries: framework?.applicable_industries || [],
    applicable_regions: framework?.applicable_regions || [],
    compliance_authority: framework?.compliance_authority || '',

    // Advanced fields - only for edit mode, but initialized here
    is_current_version: framework?.is_current_version || false,
    superseded_by: framework?.superseded_by?.id || '',
    changelog: framework?.changelog || ''
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [frameworks, setFrameworks] = useState([]); // For superseded options

  // Fetch dropdown data when modal opens
useEffect(() => {
  if (!isOpen) return;

  // Fetch dropdown data etc.
  fetchCategories();
  fetchFrameworks();

  if (framework) {
    setFormData({
      name: framework.name || '',
      full_name: framework.full_name || '',
      version: framework.version || '',
      description: framework.description || '',
      status: framework.status || 'DRAFT',
      effective_date: framework.effective_date || '',
      category: framework.category?.id || '',
      
      // Ensure array fields are arrays, not strings
      applicable_industries: Array.isArray(framework.applicable_industries)
        ? framework.applicable_industries
        : typeof framework.applicable_industries === 'string'
          ? framework.applicable_industries.split(',').map(s => s.trim())
          : [],

      applicable_regions: Array.isArray(framework.applicable_regions)
        ? framework.applicable_regions
        : typeof framework.applicable_regions === 'string'
          ? framework.applicable_regions.split(',').map(s => s.trim())
          : [],

      compliance_authority: framework.compliance_authority || '',
      is_current_version: framework.is_current_version || false,
      superseded_by: framework.superseded_by?.id || '',
      changelog: framework.changelog || ''
    });
  } else {
    // Reset formData for create mode
    setFormData({
      name: '',
      full_name: '',
      version: '',
      description: '',
      status: 'DRAFT',
      effective_date: '',
      category: '',
      applicable_industries: [],
      applicable_regions: [],
      compliance_authority: '',
      is_current_version: false,
      superseded_by: '',
      changelog: ''
    });
  }
}, [framework, isOpen]);


  const fetchCategories = async () => {
    try {
      const data = await frameworkCategoryAPI.getAll();
      const categoriesArray = Array.isArray(data) ? data : data?.results || [];
      setCategories(categoriesArray);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const fetchFrameworks = async () => {
    try {
      const data = await frameworkAPI.getAll();
      const arrayData = Array.isArray(data) ? data : data?.results || [];
      setFrameworks(arrayData);
    } catch (err) {
      console.error('Error fetching frameworks:', err);
      setFrameworks([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Only enable superseded_by select if status is DEPRECATED or SUPERSEDED
  const isSupersededAllowed = ['DEPRECATED', 'SUPERSEDED'].includes(formData.status);

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
          {/* Basic Fields */}
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
                <option value="SUPERSEDED">Superseded</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category (Optional)</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
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

          {/* Always show advanced text fields */}
          <div className="form-group">
            <label className="form-label">Applicable Industries</label>
            <input
              type="text"
              name="applicable_industries"
              className="form-input"
              placeholder="Comma-separated industries"
              value={formData.applicable_industries.join(', ')}
              onChange={(e) => {
                const vals = e.target.value.split(',').map(v => v.trim());
                setFormData(prev => ({ ...prev, applicable_industries: vals }));
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Applicable Regions</label>
            <input
              type="text"
              name="applicable_regions"
              className="form-input"
              placeholder="Comma-separated regions"
              value={formData.applicable_regions.join(', ')}
              onChange={(e) => {
                const vals = e.target.value.split(',').map(v => v.trim());
                setFormData(prev => ({ ...prev, applicable_regions: vals }));
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Compliance Authority</label>
            <input
              type="text"
              name="compliance_authority"
              className="form-input"
              placeholder="e.g., SEC, ISO, GDPR"
              value={formData.compliance_authority}
              onChange={handleChange}
            />
          </div>

          {/* Show fields only in edit mode */}
          {framework && (
            <>
              <div className="form-group">
                <label className="form-label">Is Current Version</label>
                <input
                  type="checkbox"
                  name="is_current_version"
                  checked={formData.is_current_version}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Superseded By</label>
                <select
                  name="superseded_by"
                  className="form-input"
                  value={formData.superseded_by}
                  onChange={handleChange}
                  disabled={!['DEPRECATED', 'SUPERSEDED'].includes(formData.status)}
                >
                  <option value="">None</option>
                  {frameworks
                    .filter(fw => fw.id !== framework.id)
                    .map(fw => (
                      <option key={fw.id} value={fw.id}>
                        {fw.name} v{fw.version}
                      </option>
                    ))}
                </select>
                {!['DEPRECATED', 'SUPERSEDED'].includes(formData.status) && (
                  <small className="helper-text">
                    Superseded selection is enabled only if status is Deprecated or Superseded.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Changelog</label>
                <textarea
                  name="changelog"
                  className="form-textarea"
                  placeholder="Describe changes in this version"
                  rows="4"
                  value={formData.changelog}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <i className="fas fa-check" />
              {framework ? 'Update Framework' : 'Create Framework'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFrameworkModal;
