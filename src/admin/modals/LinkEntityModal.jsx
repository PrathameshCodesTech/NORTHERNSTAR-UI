import React, { useState } from 'react';
import './CreateFrameworkModal.css';

const LinkEntityModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  entityType = 'domain',
  availableEntities = [],
  currentEntity = null
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [error, setError] = useState('');

  const getEntityIcon = () => {
    switch (entityType) {
      case 'domain':
        return 'fa-layer-group';
      case 'category':
        return 'fa-tags';
      case 'subcategory':
        return 'fa-sitemap';
      case 'control':
        return 'fa-shield-halved';
      default:
        return 'fa-link';
    }
  };

  const getEntityLabel = () => {
    switch (entityType) {
      case 'domain':
        return 'Framework';
      case 'category':
        return 'Domain';
      case 'subcategory':
        return 'Category';
      case 'control':
        return 'Subcategory';
      default:
        return 'Parent Entity';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEntityId) {
      setError(`Please select a ${getEntityLabel()}`);
      return;
    }
    onSubmit(selectedEntityId);
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
            <i className={`fas ${getEntityIcon()}`}></i>
            Link {currentEntity?.name || 'Entity'} to {getEntityLabel()}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              Select {getEntityLabel()} <span className="required">*</span>
            </label>
            <select
              className={`form-input ${error ? 'error' : ''}`}
              value={selectedEntityId}
              onChange={(e) => {
                setSelectedEntityId(e.target.value);
                setError('');
              }}
            >
              <option value="">-- Select {getEntityLabel()} --</option>
              {availableEntities.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {entity.name} {entity.code && `(${entity.code})`} {entity.version && `v${entity.version}`}
                </option>
              ))}
            </select>
            {error && <span className="error-text">{error}</span>}
          </div>

          {availableEntities.length === 0 && (
            <div className="info-message">
              <i className="fas fa-info-circle"></i>
              <p>No available {getEntityLabel().toLowerCase()}s to link to.</p>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={availableEntities.length === 0}
            >
              <i className="fas fa-link"></i>
              Link Entity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkEntityModal;