// src/tenant/compliance/PendingApprovals.jsx
import React, { useState } from 'react';
import EmptyState from '../components/EmptyState';
import './Compliance.css';

const PendingApprovals = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [approvalAction, setApprovalAction] = useState('');

  // Mock data
  const pendingItems = [
    {
      id: 'pa1',
      type: 'assignment',
      title: 'Access Control Policy Implementation',
      control_code: 'AC-001',
      framework: 'ISO 27001',
      framework_color: '#3b82f6',
      submitted_by: 'Mike Smith',
      submitted_date: '2025-11-23',
      due_date: '2025-11-28',
      priority: 'high',
      description: 'Completed implementation of multi-factor authentication across all systems',
      evidence_count: 3,
      status: 'pending'
    },
    {
      id: 'pa2',
      type: 'assessment',
      title: 'Privacy Impact Assessment Response',
      control_code: 'PR-002',
      framework: 'GDPR',
      framework_color: '#10b981',
      submitted_by: 'Sarah Chen',
      submitted_date: '2025-11-22',
      due_date: '2025-11-30',
      priority: 'medium',
      description: 'Assessment responses for data processing activities',
      questions_answered: 8,
      status: 'pending'
    },
    {
      id: 'pa3',
      type: 'evidence',
      title: 'Financial Controls Documentation',
      control_code: 'FIN-005',
      framework: 'SOX',
      framework_color: '#f59e0b',
      submitted_by: 'John Doe',
      submitted_date: '2025-11-21',
      due_date: '2025-12-05',
      priority: 'low',
      description: 'Updated financial control procedures and audit reports',
      evidence_count: 4,
      status: 'pending'
    },
    {
      id: 'pa4',
      type: 'assignment',
      title: 'Security Monitoring Setup',
      control_code: 'AC-008',
      framework: 'ISO 27001',
      framework_color: '#3b82f6',
      submitted_by: 'Emily Johnson',
      submitted_date: '2025-11-20',
      due_date: '2025-11-27',
      priority: 'high',
      description: 'Implemented 24/7 security monitoring with SIEM integration',
      evidence_count: 2,
      status: 'pending'
    }
  ];

  const getPriorityStyle = (priority) => {
    const styles = {
      high: { bg: '#fee2e2', color: '#991b1b', label: 'High Priority' },
      medium: { bg: '#fef3c7', color: '#92400e', label: 'Medium' },
      low: { bg: '#dbeafe', color: '#1e40af', label: 'Low' }
    };
    return styles[priority] || styles.medium;
  };

  const getTypeStyle = (type) => {
    const styles = {
      assignment: { icon: 'fa-tasks', label: 'Assignment', color: '#3b82f6' },
      assessment: { icon: 'fa-clipboard-question', label: 'Assessment', color: '#10b981' },
      evidence: { icon: 'fa-file-upload', label: 'Evidence', color: '#f59e0b' }
    };
    return styles[type] || styles.assignment;
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, urgent: true };
    if (diffDays === 0) return { text: 'Due today', urgent: true };
    if (diffDays <= 3) return { text: `${diffDays} days left`, urgent: true };
    return { text: `${diffDays} days left`, urgent: false };
  };

  const filteredItems = pendingItems.filter(item => {
    const matchesTab = selectedTab === 'all' || item.type === selectedTab;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.control_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submitted_by.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    all: pendingItems.length,
    assignment: pendingItems.filter(i => i.type === 'assignment').length,
    assessment: pendingItems.filter(i => i.type === 'assessment').length,
    evidence: pendingItems.filter(i => i.type === 'evidence').length
  };

  const handleApprovalAction = (item, action) => {
    setSelectedItem(item);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  return (
    <div className="pending-approvals-page">
      {/* Clean Page Header */}
      <div className="page-header-compliance">
        <div className="header-content">
          <div className="header-left">
            <h1>Pending Approvals</h1>
            <p className="header-subtitle">
              Review and approve team submissions
            </p>
          </div>
          <div className="header-action">
            <div className="header-badge">
              <i className="fas fa-clock"></i>
              <span>{stats.all} pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="approvals-content">
        {/* Tabs */}
        <div className="approvals-tabs">
          <button
            className={`tab-btn ${selectedTab === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTab('all')}
          >
            All ({stats.all})
          </button>
          <button
            className={`tab-btn ${selectedTab === 'assignment' ? 'active' : ''}`}
            onClick={() => setSelectedTab('assignment')}
          >
            <i className="fas fa-tasks"></i>
            Assignments ({stats.assignment})
          </button>
          <button
            className={`tab-btn ${selectedTab === 'assessment' ? 'active' : ''}`}
            onClick={() => setSelectedTab('assessment')}
          >
            <i className="fas fa-clipboard-question"></i>
            Assessments ({stats.assessment})
          </button>
          <button
            className={`tab-btn ${selectedTab === 'evidence' ? 'active' : ''}`}
            onClick={() => setSelectedTab('evidence')}
          >
            <i className="fas fa-file-upload"></i>
            Evidence ({stats.evidence})
          </button>
        </div>

        {/* Search */}
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search pending approvals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Approvals List */}
        {filteredItems.length > 0 ? (
          <div className="approvals-list">
            {filteredItems.map(item => {
              const priorityStyle = getPriorityStyle(item.priority);
              const typeStyle = getTypeStyle(item.type);
              const daysInfo = getDaysRemaining(item.due_date);

              return (
                <div key={item.id} className="approval-card">
                  {/* Header */}
                  <div className="approval-card-header">
                    <div className="header-left">
                      <div 
                        className="type-icon"
                        style={{ backgroundColor: `${typeStyle.color}15` }}
                      >
                        <i className={`fas ${typeStyle.icon}`} style={{ color: typeStyle.color }}></i>
                      </div>
                      <div className="approval-info">
                        <div className="approval-meta-top">
                          <span 
                            className="type-badge"
                            style={{ backgroundColor: `${typeStyle.color}15`, color: typeStyle.color }}
                          >
                            {typeStyle.label}
                          </span>
                          <span className="control-badge" style={{ backgroundColor: item.framework_color }}>
                            {item.control_code}
                          </span>
                          <span 
                            className="framework-tag"
                            style={{ backgroundColor: `${item.framework_color}15`, color: item.framework_color }}
                          >
                            {item.framework}
                          </span>
                        </div>
                        <h3 className="approval-title">{item.title}</h3>
                      </div>
                    </div>
                    <div className="header-right">
                      <div 
                        className="priority-badge"
                        style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.color }}
                      >
                        {priorityStyle.label}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="approval-description">{item.description}</p>

                  {/* Details */}
                  <div className="approval-details">
                    <div className="detail-item">
                      <i className="fas fa-user"></i>
                      <span>Submitted by <strong>{item.submitted_by}</strong></span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-calendar"></i>
                      <span>Submitted on {new Date(item.submitted_date).toLocaleDateString()}</span>
                    </div>
                    <div className={`detail-item due-date ${daysInfo.urgent ? 'urgent' : ''}`}>
                      <i className="fas fa-clock"></i>
                      <span>{daysInfo.text}</span>
                    </div>
                    {item.evidence_count && (
                      <div className="detail-item">
                        <i className="fas fa-paperclip"></i>
                        <span>{item.evidence_count} evidence files</span>
                      </div>
                    )}
                    {item.questions_answered && (
                      <div className="detail-item">
                        <i className="fas fa-check-circle"></i>
                        <span>{item.questions_answered} questions answered</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="approval-actions">
                    <button className="view-details-btn">
                      <i className="fas fa-eye"></i>
                      View Details
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => handleApprovalAction(item, 'reject')}
                    >
                      <i className="fas fa-times"></i>
                      Reject
                    </button>
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprovalAction(item, 'approve')}
                    >
                      <i className="fas fa-check"></i>
                      Approve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="fa-check-circle"
            title="No pending approvals"
            description="All submissions have been reviewed"
          />
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowApprovalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{approvalAction === 'approve' ? 'Approve' : 'Reject'} Submission</h2>
              <button className="close-btn" onClick={() => setShowApprovalModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-item-info">
                <h3>{selectedItem.title}</h3>
                <p>Submitted by {selectedItem.submitted_by}</p>
              </div>
              <div className="form-group">
                <label>Comments {approvalAction === 'reject' ? '(Required)' : '(Optional)'}</label>
                <textarea 
                  className="form-input" 
                  rows="4" 
                  placeholder={approvalAction === 'approve' ? 'Add comments for approval...' : 'Please provide reason for rejection...'}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </button>
              <button 
                className={approvalAction === 'approve' ? 'submit-btn approve' : 'submit-btn reject'}
                style={{ 
                  background: approvalAction === 'approve' 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                }}
              >
                <i className={`fas fa-${approvalAction === 'approve' ? 'check' : 'times'}`}></i>
                {approvalAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
