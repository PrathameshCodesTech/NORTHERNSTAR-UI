// src/admin/modals/ViewCategoryTooltip.jsx
import React from 'react';
import './CreateFrameworkModal.css';

const ViewCategoryTooltip = ({ isOpen, onClose, category }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-tags"></i>
            Category Details
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-form" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              color: '#0a0a0a',
              marginBottom: '0.5rem'
            }}>
              {category.name}
            </div>
            <div style={{ 
              fontSize: '1rem', 
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Code: {category.code}
            </div>
          </div>

          {category.description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Description
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                {category.description}
              </div>
            </div>
          )}

          <div style={{ 
            padding: '1rem', 
            background: '#eff6ff', 
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}>
            <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
            This subcategory is linked to this category
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-submit" onClick={onClose} style={{ width: '100%' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCategoryTooltip;