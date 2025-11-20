// src/admin/modals/LinkFrameworkModal.jsx
import React, { useState } from 'react';
import './CreateFrameworkModal.css'; // Reuse same modal styles

const LinkFrameworkModal = ({ isOpen, onClose, onSubmit, frameworks = [], domainName }) => {
  const [selectedFramework, setSelectedFramework] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFramework) {
      alert('Please select a framework');
      return;
    }
    onSubmit(selectedFramework);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="fas fa-link"></i>
            Link Domain to Framework
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              Domain: <strong>{domainName}</strong>
            </label>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Select a framework to link this domain to:
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Select Framework <span className="required">*</span>
            </label>
            
            {/* Framework Selection List */}
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.5rem'
            }}>
              {frameworks.length > 0 ? (
                frameworks.map(fw => (
                  <label
                    key={fw.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      margin: '0.25rem 0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: selectedFramework === fw.id ? '#e0f2fe' : 'transparent',
                      border: selectedFramework === fw.id ? '2px solid #0891b2' : '2px solid transparent',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedFramework !== fw.id) {
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedFramework !== fw.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="framework"
                      value={fw.id}
                      checked={selectedFramework === fw.id}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#0a0a0a' }}>
                        {fw.name} v{fw.version}
                      </div>
                      {fw.full_name && (
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          {fw.full_name}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                        Status: {fw.status}
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  color: '#6b7280' 
                }}>
                  <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                  <p>No frameworks available</p>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={!selectedFramework}
            >
              <i className="fas fa-link"></i>
              Link Domain
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkFrameworkModal;