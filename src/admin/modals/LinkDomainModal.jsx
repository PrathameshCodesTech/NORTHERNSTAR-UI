// src/admin/modals/LinkDomainModal.jsx
import React, { useState } from 'react';
import './CreateFrameworkModal.css';

const LinkDomainModal = ({ isOpen, onClose, onSubmit, domains = [], categoryName }) => {
  const [selectedDomain, setSelectedDomain] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDomain) {
      alert('Please select a domain');
      return;
    }
    onSubmit(selectedDomain);
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
            Link Category to Domain
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              Category: <strong>{categoryName}</strong>
            </label>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Select a domain to link this category to:
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Select Domain <span className="required">*</span>
            </label>
            
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.5rem'
            }}>
              {domains.length > 0 ? (
                domains.map(domain => (
                  <label
                    key={domain.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      margin: '0.25rem 0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: selectedDomain === domain.id ? '#e0f2fe' : 'transparent',
                      border: selectedDomain === domain.id ? '2px solid #0891b2' : '2px solid transparent',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDomain !== domain.id) {
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDomain !== domain.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="domain"
                      value={domain.id}
                      checked={selectedDomain === domain.id}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      style={{ marginRight: '0.75rem' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#0a0a0a' }}>
                        {domain.name}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Code: {domain.code}
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
                  <p>No domains available</p>
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
              disabled={!selectedDomain}
            >
              <i className="fas fa-link"></i>
              Link Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkDomainModal;