// src/admin/modals/ViewDomainTooltip.jsx
import React from 'react';
import './CreateFrameworkModal.css';

const ViewDomainTooltip = ({ isOpen, onClose, domain }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !domain) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-layer-group"></i>
            Domain Details
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
              {domain.name}
            </div>
            <div style={{ 
              fontSize: '1rem', 
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Code: {domain.code}
            </div>
          </div>

          {domain.description && (
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
                {domain.description}
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
            This category is linked to this domain
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

export default ViewDomainTooltip;