// src/tenant/dashboard/EmployeeDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import './TenantDashboard.css';

const EmployeeDashboard = ({ currentUser }) => {
  const navigate = useNavigate();

  // Mock data for Employee
  const dashboardData = {
    stats: {
      assignedTasks: 5,
      pendingAssessments: 3,
      submitted: 2,
      upcomingDeadlines: 2
    },
    myAssignments: [
      {
        id: 1,
        control: 'AC-001',
        title: 'Multi-Factor Authentication Implementation',
        framework: 'ISO 27001',
        dueDate: '2025-11-28',
        daysLeft: 4,
        priority: 'high',
        status: 'in_progress',
        assessmentComplete: false,
        evidenceUploaded: 2,
        evidenceRequired: 3
      },
      {
        id: 2,
        control: 'AC-005',
        title: 'Access Control Review',
        framework: 'ISO 27001',
        dueDate: '2025-12-05',
        daysLeft: 11,
        priority: 'medium',
        status: 'in_progress',
        assessmentComplete: true,
        evidenceUploaded: 3,
        evidenceRequired: 3
      },
      {
        id: 3,
        control: 'PR-001',
        title: 'Privacy Policy Update',
        framework: 'GDPR',
        dueDate: '2025-12-10',
        daysLeft: 16,
        priority: 'low',
        status: 'not_started',
        assessmentComplete: false,
        evidenceUploaded: 0,
        evidenceRequired: 2
      }
    ],
    pendingAssessments: [
      {
        id: 1,
        control: 'AC-001',
        title: 'Multi-Factor Authentication Implementation',
        framework: 'ISO 27001',
        questionsTotal: 12,
        questionsAnswered: 8
      },
      {
        id: 2,
        control: 'PR-001',
        title: 'Privacy Policy Update',
        framework: 'GDPR',
        questionsTotal: 8,
        questionsAnswered: 0
      }
    ],
    submittedWork: [
      {
        id: 1,
        control: 'AC-003',
        title: 'Password Policy Implementation',
        submittedDate: '2025-11-22',
        status: 'pending_review',
        reviewer: 'Emily Davis (Manager)'
      },
      {
        id: 2,
        control: 'AC-012',
        title: 'Firewall Configuration',
        submittedDate: '2025-11-20',
        status: 'pending_review',
        reviewer: 'Sarah Johnson (Compliance Manager)'
      }
    ],
    upcomingDeadlines: [
      {
        id: 1,
        control: 'AC-001',
        title: 'Multi-Factor Authentication Implementation',
        dueDate: '2025-11-28',
        daysLeft: 4,
        priority: 'high'
      },
      {
        id: 2,
        control: 'AC-005',
        title: 'Access Control Review',
        dueDate: '2025-12-05',
        daysLeft: 11,
        priority: 'medium'
      }
    ]
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: { bg: '#fee2e2', color: '#991b1b', label: 'High Priority' },
      medium: { bg: '#fef3c7', color: '#92400e', label: 'Medium' },
      low: { bg: '#dbeafe', color: '#1e40af', label: 'Low' }
    };
    return styles[priority] || styles.low;
  };

  const getStatusBadge = (status) => {
    const badges = {
      in_progress: { label: 'In Progress', class: 'status-progress' },
      not_started: { label: 'Not Started', class: 'status-not-started' },
      pending_review: { label: 'Pending Review', class: 'status-pending' },
      completed: { label: 'Completed', class: 'status-completed' }
    };
    return badges[status] || badges.not_started;
  };

  return (
    <div className="tenant-dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>My Dashboard</h1>
          <p className="header-subtitle">Welcome back, {currentUser.name} 👋</p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon="fa-tasks"
            title="Assigned Tasks"
            value={dashboardData.stats.assignedTasks}
            subtitle="Active assignments"
            color="#3b82f6"
            onClick={() => navigate('/app/assignments')}
          />
          <StatCard
            icon="fa-clipboard-question"
            title="Pending Assessments"
            value={dashboardData.stats.pendingAssessments}
            subtitle="To complete"
            color="#f59e0b"
            onClick={() => navigate('/app/assessments')}
          />
          <StatCard
            icon="fa-clock"
            title="Submitted Work"
            value={dashboardData.stats.submitted}
            subtitle="Awaiting review"
            color="#8b5cf6"
          />
          <StatCard
            icon="fa-calendar-check"
            title="Upcoming Deadlines"
            value={dashboardData.stats.upcomingDeadlines}
            subtitle="Next 7 days"
            color="#10b981"
          />
        </div>

        {/* My Active Assignments */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>
              <i className="fas fa-tasks" style={{ color: '#3b82f6', marginRight: '8px' }}></i>
              My Active Assignments
            </h2>
            <button className="view-all-btn" onClick={() => navigate('/app/assignments')}>
              View All <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="employee-assignments-list">
            {dashboardData.myAssignments.map(assignment => {
              const priorityStyle = getPriorityBadge(assignment.priority);
              const statusBadge = getStatusBadge(assignment.status);
              return (
                <div key={assignment.id} className="employee-assignment-card">
                  <div className="assignment-header-row">
                    <div className="control-badge">{assignment.control}</div>
                    <span 
                      className="priority-badge" 
                      style={{ 
                        backgroundColor: priorityStyle.bg, 
                        color: priorityStyle.color 
                      }}
                    >
                      {priorityStyle.label}
                    </span>
                  </div>
                  <div className="assignment-title-large">{assignment.title}</div>
                  <div className="assignment-meta-row">
                    <span className="framework-tag">{assignment.framework}</span>
                    <span className="due-date-employee">
                      <i className="fas fa-calendar"></i> Due: {assignment.dueDate} ({assignment.daysLeft} days left)
                    </span>
                  </div>
                  
                  {/* Progress Indicators */}
                  <div className="assignment-progress">
                    <div className="progress-item">
                      <span className="progress-label">Assessment:</span>
                      {assignment.assessmentComplete ? (
                        <span className="progress-status complete">
                          <i className="fas fa-check-circle"></i> Complete
                        </span>
                      ) : (
                        <span className="progress-status incomplete">
                          <i className="fas fa-circle-notch"></i> Incomplete
                        </span>
                      )}
                    </div>
                    <div className="progress-item">
                      <span className="progress-label">Evidence:</span>
                      <span className={`progress-status ${assignment.evidenceUploaded === assignment.evidenceRequired ? 'complete' : 'incomplete'}`}>
                        {assignment.evidenceUploaded}/{assignment.evidenceRequired} files
                      </span>
                    </div>
                    <div className="progress-item">
                      <span className="progress-label">Status:</span>
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="assignment-actions">
                    {!assignment.assessmentComplete && (
                      <button className="btn-action-primary" onClick={() => navigate('/app/assessments')}>
                        <i className="fas fa-clipboard-check"></i> Complete Assessment
                      </button>
                    )}
                    {assignment.evidenceUploaded < assignment.evidenceRequired && (
                      <button className="btn-action-secondary" onClick={() => navigate('/app/evidence')}>
                        <i className="fas fa-upload"></i> Upload Evidence
                      </button>
                    )}
                    {assignment.assessmentComplete && assignment.evidenceUploaded === assignment.evidenceRequired && (
                      <button className="btn-action-success">
                        <i className="fas fa-paper-plane"></i> Submit for Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Pending Assessments */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Pending Assessments</h2>
              <button className="view-all-btn" onClick={() => navigate('/app/assessments')}>
                View All <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="assessments-list">
              {dashboardData.pendingAssessments.map(assessment => {
                const progressPercentage = Math.round((assessment.questionsAnswered / assessment.questionsTotal) * 100);
                return (
                  <div key={assessment.id} className="assessment-item">
                    <div className="assessment-info">
                      <div className="control-badge">{assessment.control}</div>
                      <div className="assessment-details">
                        <div className="assessment-title">{assessment.title}</div>
                        <div className="assessment-meta">
                          <span className="framework-tag">{assessment.framework}</span>
                        </div>
                      </div>
                    </div>
                    <div className="assessment-progress-section">
                      <div className="assessment-questions">
                        {assessment.questionsAnswered}/{assessment.questionsTotal} questions
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <button className="btn-continue" onClick={() => navigate('/app/assessments')}>
                        {assessment.questionsAnswered === 0 ? 'Start' : 'Continue'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submitted Work Status */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Submitted Work</h2>
            </div>
            <div className="submitted-work-list">
              {dashboardData.submittedWork.map(work => {
                const statusBadge = getStatusBadge(work.status);
                return (
                  <div key={work.id} className="submitted-work-item">
                    <div className="control-badge">{work.control}</div>
                    <div className="submitted-work-info">
                      <div className="submitted-work-title">{work.title}</div>
                      <div className="submitted-work-meta">
                        Submitted: {work.submittedDate}
                      </div>
                      <div className="submitted-work-reviewer">
                        <i className="fas fa-user"></i> Reviewer: {work.reviewer}
                      </div>
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>
              <i className="fas fa-calendar-check" style={{ color: '#10b981', marginRight: '8px' }}></i>
              Upcoming Deadlines
            </h2>
          </div>
          <div className="deadlines-timeline">
            {dashboardData.upcomingDeadlines.map(deadline => {
              const priorityStyle = getPriorityBadge(deadline.priority);
              return (
                <div key={deadline.id} className="deadline-timeline-item">
                  <div className="deadline-date-box">
                    <div className="deadline-days">{deadline.daysLeft}</div>
                    <div className="deadline-days-label">days left</div>
                  </div>
                  <div className="deadline-details-section">
                    <div className="control-badge">{deadline.control}</div>
                    <div className="deadline-title">{deadline.title}</div>
                    <div className="deadline-due-date">Due: {deadline.dueDate}</div>
                  </div>
                  <span 
                    className="priority-badge" 
                    style={{ 
                      backgroundColor: priorityStyle.bg, 
                      color: priorityStyle.color 
                    }}
                  >
                    {priorityStyle.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-card" onClick={() => navigate('/app/assignments')}>
              <i className="fas fa-tasks"></i>
              <span>View My Tasks</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/assessments')}>
              <i className="fas fa-clipboard-check"></i>
              <span>Complete Assessment</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/evidence')}>
              <i className="fas fa-upload"></i>
              <span>Upload Evidence</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/frameworks')}>
              <i className="fas fa-book-open"></i>
              <span>View Requirements</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;