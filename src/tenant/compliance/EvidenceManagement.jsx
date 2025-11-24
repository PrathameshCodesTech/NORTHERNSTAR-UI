// src/tenant/compliance/EvidenceManagement.jsx
import React, { useState } from 'react';
import EmptyState from '../components/EmptyState';
import './Compliance.css';

const EvidenceManagement = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock data
  const evidenceDocuments = [
    {
      id: 'e1',
      title: 'MFA Configuration Screenshot',
      control_code: 'AC-001',
      control_title: 'Multi-Factor Authentication',
      framework: 'ISO 27001',
      framework_color: '#3b82f6',
      file_name: 'mfa_config.png',
      file_size: '2.4 MB',
      file_type: 'image/png',
      uploaded_by: 'You',
      uploaded_date: '2025-11-22',
      status: 'verified',
      verified_by: 'Sarah Chen',
      verified_date: '2025-11-23',
      comments: 'Configuration looks good. Approved.'
    },
    {
      id: 'e2',
      title: 'Privacy Policy Document',
      control_code: 'PR-002',
      control_title: 'Privacy Impact Assessment',
      framework: 'GDPR',
      framework_color: '#10b981',
      file_name: 'privacy_policy_v2.pdf',
      file_size: '856 KB',
      file_type: 'application/pdf',
      uploaded_by: 'You',
      uploaded_date: '2025-11-20',
      status: 'pending',
      verified_by: null,
      verified_date: null,
      comments: null
    },
    {
      id: 'e3',
      title: 'Financial Audit Report Q3',
      control_code: 'FIN-005',
      control_title: 'Financial Controls Documentation',
      framework: 'SOX',
      framework_color: '#f59e0b',
      file_name: 'q3_audit_report.xlsx',
      file_size: '3.2 MB',
      file_type: 'application/vnd.ms-excel',
      uploaded_by: 'Mike Smith',
      uploaded_date: '2025-11-18',
      status: 'verified',
      verified_by: 'John Manager',
      verified_date: '2025-11-19',
      comments: 'All financial controls properly documented.'
    },
    {
      id: 'e4',
      title: 'Access Control Matrix',
      control_code: 'AC-008',
      control_title: 'Access Control Policy',
      framework: 'ISO 27001',
      framework_color: '#3b82f6',
      file_name: 'access_matrix.docx',
      file_size: '124 KB',
      file_type: 'application/msword',
      uploaded_by: 'You',
      uploaded_date: '2025-11-15',
      status: 'rejected',
      verified_by: 'Sarah Chen',
      verified_date: '2025-11-16',
      comments: 'Please update the matrix to include all departments.'
    }
  ];

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending Review', icon: 'fa-clock' },
      verified: { bg: '#d1fae5', color: '#065f46', label: 'Verified', icon: 'fa-check-circle' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected', icon: 'fa-times-circle' }
    };
    return styles[status] || styles.pending;
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return 'fa-file-image';
    if (fileType.includes('pdf')) return 'fa-file-pdf';
    if (fileType.includes('word')) return 'fa-file-word';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'fa-file-excel';
    return 'fa-file';
  };

  const filteredEvidence = evidenceDocuments.filter(e => {
    const matchesTab = selectedTab === 'all' || e.status === selectedTab;
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.control_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    all: evidenceDocuments.length,
    pending: evidenceDocuments.filter(e => e.status === 'pending').length,
    verified: evidenceDocuments.filter(e => e.status === 'verified').length,
    rejected: evidenceDocuments.filter(e => e.status === 'rejected').length
  };

  return (
    <div className="evidence-management-page">
      {/* Clean Page Header */}
      <div className="page-header-compliance">
        <div className="header-content">
          <div className="header-left">
            <h1>Evidence Management</h1>
            <p className="header-subtitle">
              Upload and manage compliance evidence documents
            </p>
          </div>
          <div className="header-action">
            <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
              <i className="fas fa-cloud-upload"></i>
              Upload Evidence
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="evidence-content">
        {/* Stats Cards */}
        <div className="evidence-stats">
          <div className="stat-card-small">
            <i className="fas fa-folder" style={{ color: '#3b82f6' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.all}</span>
              <span className="stat-label">Total Documents</span>
            </div>
          </div>
          <div className="stat-card-small">
            <i className="fas fa-clock" style={{ color: '#f59e0b' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending Review</span>
            </div>
          </div>
          <div className="stat-card-small">
            <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.verified}</span>
              <span className="stat-label">Verified</span>
            </div>
          </div>
          <div className="stat-card-small">
            <i className="fas fa-times-circle" style={{ color: '#ef4444' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.rejected}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="evidence-tabs">
          <button
            className={`tab-btn ${selectedTab === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTab('all')}
          >
            All Documents ({stats.all})
          </button>
          <button
            className={`tab-btn ${selectedTab === 'pending' ? 'active' : ''}`}
            onClick={() => setSelectedTab('pending')}
          >
            Pending ({stats.pending})
          </button>
          <button
            className={`tab-btn ${selectedTab === 'verified' ? 'active' : ''}`}
            onClick={() => setSelectedTab('verified')}
          >
            Verified ({stats.verified})
          </button>
          <button
            className={`tab-btn ${selectedTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setSelectedTab('rejected')}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Search */}
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search evidence documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Evidence List */}
        {filteredEvidence.length > 0 ? (
          <div className="evidence-list">
            {filteredEvidence.map(evidence => {
              const statusStyle = getStatusStyle(evidence.status);
              const fileIcon = getFileIcon(evidence.file_type);

              return (
                <div key={evidence.id} className="evidence-card">
                  {/* File Icon */}
                  <div className="file-icon-container">
                    <i className={`fas ${fileIcon}`}></i>
                  </div>

                  {/* Content */}
                  <div className="evidence-card-content">
                    <div className="evidence-header">
                      <h3 className="evidence-title">{evidence.title}</h3>
                      <div 
                        className="status-badge"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                      >
                        <i className={`fas ${statusStyle.icon}`}></i>
                        {statusStyle.label}
                      </div>
                    </div>

                    <div className="evidence-meta">
                      <div className="control-info">
                        <span 
                          className="control-badge"
                          style={{ backgroundColor: evidence.framework_color }}
                        >
                          {evidence.control_code}
                        </span>
                        <span className="control-title">{evidence.control_title}</span>
                      </div>
                      <span 
                        className="framework-tag"
                        style={{ backgroundColor: `${evidence.framework_color}15`, color: evidence.framework_color }}
                      >
                        {evidence.framework}
                      </span>
                    </div>

                    <div className="file-info">
                      <div className="file-details">
                        <i className="fas fa-file"></i>
                        <span className="file-name">{evidence.file_name}</span>
                        <span className="file-size">{evidence.file_size}</span>
                      </div>
                      <div className="upload-info">
                        <i className="fas fa-user"></i>
                        <span>{evidence.uploaded_by}</span>
                        <span className="separator">•</span>
                        <i className="fas fa-calendar"></i>
                        <span>{new Date(evidence.uploaded_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Verification Info */}
                    {evidence.status === 'verified' && (
                      <div className="verification-info success">
                        <i className="fas fa-check-circle"></i>
                        <span>Verified by {evidence.verified_by} on {new Date(evidence.verified_date).toLocaleDateString()}</span>
                      </div>
                    )}

                    {evidence.status === 'rejected' && (
                      <div className="verification-info error">
                        <i className="fas fa-exclamation-circle"></i>
                        <div>
                          <strong>Rejected by {evidence.verified_by}:</strong>
                          <p>{evidence.comments}</p>
                        </div>
                      </div>
                    )}

                    {evidence.comments && evidence.status === 'verified' && (
                      <div className="comments-box">
                        <i className="fas fa-comment"></i>
                        <p>{evidence.comments}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="evidence-actions">
                    <button className="action-btn view">
                      <i className="fas fa-eye"></i>
                      View
                    </button>
                    <button className="action-btn download">
                      <i className="fas fa-download"></i>
                      Download
                    </button>
                    {evidence.status === 'rejected' && (
                      <button className="action-btn reupload">
                        <i className="fas fa-redo"></i>
                        Re-upload
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="fa-file-upload"
            title="No evidence documents found"
            description="Upload evidence documents to support your compliance controls"
            actionLabel="Upload Evidence"
            onAction={() => setShowUploadModal(true)}
          />
        )}
      </div>

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Evidence</h2>
              <button className="close-btn" onClick={() => setShowUploadModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Evidence upload functionality will be implemented with form fields for:</p>
              <ul>
                <li>Control selection</li>
                <li>Document title</li>
                <li>File upload</li>
                <li>Description/Notes</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
              <button className="submit-btn">
                <i className="fas fa-upload"></i>
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceManagement;