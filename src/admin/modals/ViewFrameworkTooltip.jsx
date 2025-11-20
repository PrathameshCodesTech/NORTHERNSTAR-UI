// src/admin/modals/ViewFrameworkTooltip.jsx
import React from 'react';
import './CreateFrameworkModal.css';

const ViewFrameworkTooltip = ({ isOpen, onClose, framework }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !framework) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-folder-tree"></i>
            Framework Details
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-form" style={{ padding: '1.5rem' }}>
          {/* Framework Name & Version */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              color: '#0a0a0a',
              marginBottom: '0.5rem'
            }}>
              {framework.name} v{framework.version}
            </div>
            <div style={{ 
              fontSize: '1rem', 
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              {framework.full_name}
            </div>
            <span style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: framework.status === 'ACTIVE' ? '#d1fae5' : '#fef3c7',
              color: framework.status === 'ACTIVE' ? '#065f46' : '#92400e'
            }}>
              {framework.status}
            </span>
          </div>

          {/* Description */}
          {framework.description && (
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
                {framework.description}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              padding: '1rem', 
              background: '#f9fafb', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0891b2' }}>
                {framework.domain_count || 0}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Domains
              </div>
            </div>
            <div style={{ 
              padding: '1rem', 
              background: '#f9fafb', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7c3aed' }}>
                {framework.control_count || 0}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Controls
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div style={{ 
            padding: '1rem', 
            background: '#eff6ff', 
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}>
            <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
            This domain is linked to this framework
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

export default ViewFrameworkTooltip;