// src/admin/modals/AddQuestionModal.jsx
import React, { useState, useEffect } from 'react';
import './CreateFrameworkModal.css';

const AddQuestionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  question = null,
  controls = [],
  currentControlId = null 
}) => {
  const [formData, setFormData] = useState({
    question: '',
    question_type: 'YES_NO',
    options: [],
    is_mandatory: true,
    control: '', // ✅ Control is REQUIRED
    sort_order: 1
  });

  const [optionInput, setOptionInput] = useState('');
  const [errors, setErrors] = useState({});

  // ============================================================================
  // RESET FORM WHEN MODAL OPENS
  // ============================================================================
  useEffect(() => {
    if (!isOpen) return;

    if (question) {
      // EDIT MODE
      setFormData({
        question: question.question || '',
        question_type: question.question_type || 'YES_NO',
        options: question.options || [],
        is_mandatory: question.is_mandatory !== undefined ? question.is_mandatory : true,
        control: question.control || '',
        sort_order: question.sort_order || 1
      });
    } else {
      // CREATE MODE
      setFormData({
        question: '',
        question_type: 'YES_NO',
        options: [],
        is_mandatory: true,
        control: currentControlId || '', // Pre-select if coming from control detail
        sort_order: 1
      });
    }

    setOptionInput('');
    setErrors({});

  }, [isOpen, question, currentControlId]);

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================
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

    // Clear options if switching away from MULTIPLE_CHOICE
    if (name === 'question_type' && value !== 'MULTIPLE_CHOICE') {
      setFormData(prev => ({
        ...prev,
        options: []
      }));
    }
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, optionInput.trim()]
      }));
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  // ============================================================================
  // VALIDATION
  // ============================================================================
  const validate = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    if (!formData.control) {
      newErrors.control = 'Control is required';
    }
    
    if (formData.question_type === 'MULTIPLE_CHOICE' && formData.options.length === 0) {
      newErrors.options = 'Add at least one option for multiple choice questions';
    }
    
    return newErrors;
  };

  // ============================================================================
  // SUBMIT
  // ============================================================================
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ✅ Prepare data for API
    const submitData = {
      question: formData.question.trim(),
      question_type: formData.question_type,
      options: formData.question_type === 'MULTIPLE_CHOICE' ? formData.options : [],
      is_mandatory: formData.is_mandatory,
      control: formData.control, // UUID
      sort_order: parseInt(formData.sort_order, 10) || 1
    };

    console.log('Submitting question data:', submitData);
    onSubmit(submitData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Get selected control info for display
  const selectedControl = controls.find(c => c.id === formData.control);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container modal-large">
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-circle-question"></i>
            {question ? 'Edit Assessment Question' : 'Add Assessment Question'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Control Selection */}
          <div className="form-group">
            <label className="form-label">
              Control <span className="required">*</span>
            </label>
            <select
              name="control"
              className={`form-input ${errors.control ? 'error' : ''}`}
              value={formData.control}
              onChange={handleChange}
            >
              <option value="">-- Select Control --</option>
              {controls.map(control => (
                <option key={control.id} value={control.id}>
                  {control.control_code} - {control.title}
                </option>
              ))}
            </select>
            {errors.control && <span className="error-text">{errors.control}</span>}
            {selectedControl && (
              <small className="helper-text">
                Selected: {selectedControl.control_code} - {selectedControl.title}
              </small>
            )}
          </div>

          {/* Question Text */}
          <div className="form-group">
            <label className="form-label">
              Question <span className="required">*</span>
            </label>
            <textarea
              name="question"
              className={`form-textarea ${errors.question ? 'error' : ''}`}
              placeholder="Enter your assessment question..."
              rows="3"
              value={formData.question}
              onChange={handleChange}
            ></textarea>
            {errors.question && <span className="error-text">{errors.question}</span>}
          </div>

          {/* Question Type & Sort Order */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Question Type <span className="required">*</span>
              </label>
              <select
                name="question_type"
                className="form-input"
                value={formData.question_type}
                onChange={handleChange}
              >
                <option value="YES_NO">Yes/No</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TEXT">Text Response</option>
                <option value="NUMERIC">Numeric</option>
                <option value="DATE">Date</option>
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

          {/* Multiple Choice Options */}
          {formData.question_type === 'MULTIPLE_CHOICE' && (
            <div className="form-group">
              <label className="form-label">
                Options <span className="required">*</span>
              </label>
              <div className="option-input-wrapper">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter an option..."
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="add-option-btn"
                  onClick={handleAddOption}
                >
                  <i className="fas fa-plus"></i>
                  Add
                </button>
              </div>
              {errors.options && <span className="error-text">{errors.options}</span>}
              
              {formData.options.length > 0 && (
                <div className="options-list">
                  {formData.options.map((option, index) => (
                    <div key={index} className="option-item">
                      <span className="option-text">{option}</span>
                      <button
                        type="button"
                        className="remove-option-btn"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mandatory Checkbox */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_mandatory"
                checked={formData.is_mandatory}
                onChange={handleChange}
              />
              <span>This is a mandatory question</span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              <i className="fas fa-check"></i>
              {question ? 'Update Question' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;