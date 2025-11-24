// src/tenant/compliance/MyAssignments.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import './Compliance.css';

const MyAssignments = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('due_date');

  // Mock data
  const assignments = [
    {
      id: 'a1',
      control_code: 'AC-001',
      control_title: 'Multi-Factor Authentication Implementation',
      framework: 'ISO 27001',
      framework_color: '#3b82f6',
      assigned_date: '2025-11-15',
      due_date: '2025-11-28',
      priority: 'high',
      status: 'in-progress',
      progress: 60,
      assigned_by: 'Sarah Chen',
      description: 'Implement and configure MFA across all critical systems',
      evidence_required: 3,
      evidence_uploaded: 1,
      questions_total: 5,
      questions_answered: 3
    },
    {
      id: 'a2',
      control_code: 'PR-002',
      control_title: 'Privacy Impact Assessment',
      framework: 'GDPR',
      framework_color: '#10b981',
      assigned_date: '2025-11-18',
      due_date: '2025-11-30',
      priority: 'medium',
      status: 'pending',
      progress: 0,
      assigned_by: 'Mike Johnson',
      description: 'Conduct privacy impact assessment for new data processing activities',
      evidence_required: 2,
      evidence_uploaded: 0,
      questions_total: 8,
      questions_answered: 0
    },
    {
      id: 'a3',
      control_code: 'FIN-005',
      control_title: 'Financial Controls Documentation',
      framework: 'SOX',
      framework_color: '#f59e0b',
      assigned_date: '2025-10-20',
      due_date: '2025-11-20',
      priority: 'low',
      status: 'completed',
      progress: 100,
      assigned_by: 'John Manager',
      description: 'Document all financial control processes and procedures',
      evidence_required: 4,
      evidence_uploaded: 4,
      questions_total: 6,
      questions_answered: 6
    },
    {
      id: 'a4',
      control_code: 'AC-008',
      control_title: 'Access Control Policy Review',
      framework: 'ISO 27001',
      framework_color: '#3b82f6',
      assigned_date: '2025-11-20',
      due_date: '2025-12-05',
      priority: 'medium',
      status: 'in-progress',
      progress: 40,
      assigned_by: 'Sarah Chen',
      description: 'Review and update access control policies',
      evidence_required: 2,
      evidence_uploaded: 1,
      questions_total: 4,
      questions_answered: 2
    }
  ];

  const getPriorityStyle = (priority) => {
    const styles = {
      high: { bg: '#fee2e2', color: '#991b1b', label: 'High Priority', icon: 'fa-exclamation-circle' },
      medium: { bg: '#fef3c7', color: '#92400e', label: 'Medium', icon: 'fa-info-circle' },
      low: { bg: '#dbeafe', color: '#1e40af', label: 'Low', icon: 'fa-check-circle' }
    };
    return styles[priority] || styles.medium;
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: '#f3f4f6', color: '#4b5563', label: 'Not Started', icon: 'fa-clock' },
      'in-progress': { bg: '#fef3c7', color: '#92400e', label: 'In Progress', icon: 'fa-spinner' },
      completed: { bg: '#d1fae5', color: '#065f46', label: 'Completed', icon: 'fa-check-circle' },
      overdue: { bg: '#fee2e2', color: '#991b1b', label: 'Overdue', icon: 'fa-exclamation-triangle' }
    };
    return styles[status] || styles.pending;
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)} days overdue`, urgent: true };
    if (diffDays === 0) return { text: 'Due today', urgent: true };
    if (diffDays === 1) return { text: 'Due tomorrow', urgent: true };
    if (diffDays <= 3) return { text: `${diffDays} days left`, urgent: true };
    return { text: `${diffDays} days left`, urgent: false };
  };

  const filteredAssignments = assignments
    .filter(a => {
      const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
      const matchesSearch = 
        a.control_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.control_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.framework.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'due_date') {
        return new Date(a.due_date) - new Date(b.due_date);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'framework') {
        return a.framework.localeCompare(b.framework);
      }
      return 0;
    });

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    in_progress: assignments.filter(a => a.status === 'in-progress').length,
    completed: assignments.filter(a => a.status === 'completed').length
  };

  return (
    <div className="my-assignments-page">
      {/* Clean Page Header */}
      <div className="page-header-compliance">
        <div className="header-content">
          <div className="header-left">
            <h1>My Assignments</h1>
            <p className="header-subtitle">
              Manage your compliance control assignments
            </p>
          </div>
          <div className="header-action">
            <div className="header-stats-grid">
              <div className="header-stat-box">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="header-stat-box">
                <span className="stat-value">{stats.in_progress}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="header-stat-box">
                <span className="stat-value">{stats.completed}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="assignments-content">
        {/* Filters */}
        <div className="assignments-filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
              <option value="framework">Framework</option>
            </select>
          </div>
        </div>

        {/* Assignments List */}
        {filteredAssignments.length > 0 ? (
          <div className="assignments-list">
            {filteredAssignments.map(assignment => {
              const priorityStyle = getPriorityStyle(assignment.priority);
              const statusStyle = getStatusStyle(assignment.status);
              const daysInfo = getDaysRemaining(assignment.due_date);

              return (
                <div key={assignment.id} className="assignment-card">
                  {/* Header */}
                  <div className="assignment-header">
                    <div className="header-left">
                      <div className="control-code-badge" style={{ backgroundColor: assignment.framework_color }}>
                        {assignment.control_code}
                      </div>
                      <div className="assignment-title-section">
                        <h3 className="assignment-title">{assignment.control_title}</h3>
                        <div className="assignment-meta">
                          <span className="framework-tag" style={{ backgroundColor: `${assignment.framework_color}15`, color: assignment.framework_color }}>
                            {assignment.framework}
                          </span>
                          <span className="separator">•</span>
                          <span className="assigned-by">Assigned by {assignment.assigned_by}</span>
                        </div>
                      </div>
                    </div>
                    <div className="header-right">
                      <div 
                        className="priority-badge"
                        style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.color }}
                      >
                        <i className={`fas ${priorityStyle.icon}`}></i>
                        {priorityStyle.label}
                      </div>
                      <div 
                        className="status-badge"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                      >
                        <i className={`fas ${statusStyle.icon}`}></i>
                        {statusStyle.label}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="assignment-description">{assignment.description}</p>

                  {/* Progress Bar */}
                  <div className="progress-section">
                    <div className="progress-header">
                      <span className="progress-label">Overall Progress</span>
                      <span className="progress-percent">{assignment.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${assignment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Task Stats */}
                  <div className="task-stats">
                    <div className="task-stat">
                      <i className="fas fa-clipboard-question"></i>
                      <span>Questions: {assignment.questions_answered}/{assignment.questions_total}</span>
                    </div>
                    <div className="task-stat">
                      <i className="fas fa-file-upload"></i>
                      <span>Evidence: {assignment.evidence_uploaded}/{assignment.evidence_required}</span>
                    </div>
                    <div className={`task-stat due-date ${daysInfo.urgent ? 'urgent' : ''}`}>
                      <i className="fas fa-calendar"></i>
                      <span>{daysInfo.text}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="assignment-actions">
                    {assignment.status === 'completed' ? (
                      <button className="view-btn">
                        <i className="fas fa-eye"></i>
                        View Details
                      </button>
                    ) : (
                      <>
                        <button className="continue-btn">
                          <i className="fas fa-play"></i>
                          Continue Working
                        </button>
                        <button className="evidence-btn" onClick={() => navigate('/app/evidence')}>
                          <i className="fas fa-file-upload"></i>
                          Upload Evidence
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="fa-tasks"
            title="No assignments found"
            description="You don't have any assignments matching the selected filters"
          />
        )}
      </div>
    </div>
  );
};

export default MyAssignments;