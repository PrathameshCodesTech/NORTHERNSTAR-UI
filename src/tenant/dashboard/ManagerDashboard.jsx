// src/tenant/dashboard/ManagerDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import './TenantDashboard.css';

const ManagerDashboard = ({ currentUser }) => {
  const navigate = useNavigate();

  // Mock data for Manager
  const dashboardData = {
    stats: {
      teamSize: 8,
      teamPendingTasks: 12,
      myPendingApprovals: 5,
      departmentCompliance: 65
    },
    myAssignments: [
      {
        id: 1,
        control: 'AC-015',
        title: 'Department Access Review',
        framework: 'ISO 27001',
        dueDate: '2025-11-28',
        priority: 'high',
        status: 'in_progress'
      },
      {
        id: 2,
        control: 'PR-008',
        title: 'Data Processing Assessment',
        framework: 'GDPR',
        dueDate: '2025-12-05',
        priority: 'medium',
        status: 'not_started'
      }
    ],
    teamTasks: [
      {
        id: 1,
        member: 'John Doe',
        control: 'AC-001',
        title: 'MFA Implementation',
        dueDate: '2025-11-28',
        status: 'in_progress',
        daysLeft: 4
      },
      {
        id: 2,
        member: 'Mary Smith',
        control: 'AC-002',
        title: 'Password Policy Update',
        dueDate: '2025-11-30',
        status: 'pending',
        daysLeft: 6
      },
      {
        id: 3,
        member: 'Tom Wilson',
        control: 'AC-003',
        title: 'User Access Audit',
        dueDate: '2025-12-02',
        status: 'not_started',
        daysLeft: 8
      }
    ],
    pendingApprovals: [
      {
        id: 1,
        control: 'AC-005',
        title: 'Network Security Configuration',
        submittedBy: 'John Doe',
        submittedDate: '2025-11-23',
        evidenceCount: 3
      },
      {
        id: 2,
        control: 'AC-012',
        title: 'Firewall Rules Documentation',
        submittedBy: 'Mary Smith',
        submittedDate: '2025-11-22',
        evidenceCount: 2
      }
    ],
    departmentProgress: {
      completed: 13,
      inProgress: 8,
      notStarted: 4,
      total: 25
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      in_progress: { label: 'In Progress', class: 'status-progress' },
      pending: { label: 'Pending', class: 'status-pending' },
      not_started: { label: 'Not Started', class: 'status-not-started' },
      completed: { label: 'Completed', class: 'status-completed' }
    };
    return badges[status] || badges.pending;
  };

  const getPriorityClass = (priority) => {
    const classes = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return classes[priority] || classes.medium;
  };

  return (
    <div className="tenant-dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Department Dashboard</h1>
          <p className="header-subtitle">Welcome back, {currentUser.name} 👋</p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon="fa-users"
            title="Team Size"
            value={dashboardData.stats.teamSize}
            subtitle="Active members"
            color="#3b82f6"
          />
          <StatCard
            icon="fa-tasks"
            title="Team Tasks"
            value={dashboardData.stats.teamPendingTasks}
            subtitle="Pending completion"
            color="#10b981"
          />
          <StatCard
            icon="fa-check-circle"
            title="Pending Approvals"
            value={dashboardData.stats.myPendingApprovals}
            subtitle="Awaiting your review"
            color="#f59e0b"
            onClick={() => navigate('/app/approvals')}
          />
          <StatCard
            icon="fa-chart-line"
            title="Department Score"
            value={`${dashboardData.stats.departmentCompliance}%`}
            subtitle="Compliance rate"
            color="#8b5cf6"
          />
        </div>

        {/* My Assignments */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>My Assigned Controls</h2>
            <button className="view-all-btn" onClick={() => navigate('/app/assignments')}>
              View All <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="assignments-list">
            {dashboardData.myAssignments.map(assignment => {
              const statusBadge = getStatusBadge(assignment.status);
              return (
                <div key={assignment.id} className="assignment-item">
                  <div className="assignment-left">
                    <div className={`control-badge ${getPriorityClass(assignment.priority)}`}>
                      {assignment.control}
                    </div>
                    <div className="assignment-info">
                      <div className="assignment-title">{assignment.title}</div>
                      <div className="assignment-meta">
                        <span className="framework-tag">{assignment.framework}</span>
                        <span> • Due: {assignment.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="assignment-right">
                    <span className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Team Tasks */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Team Member Tasks</h2>
            </div>
            <div className="team-tasks-list">
              {dashboardData.teamTasks.map(task => {
                const statusBadge = getStatusBadge(task.status);
                return (
                  <div key={task.id} className="team-task-item">
                    <div className="task-member">{task.member}</div>
                    <div className="task-details">
                      <div className="task-control">{task.control}</div>
                      <div className="task-title">{task.title}</div>
                      <div className="task-meta">
                        <span className={`status-badge ${statusBadge.class}`}>
                          {statusBadge.label}
                        </span>
                        <span className="task-due"> • {task.daysLeft} days left</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Team Approvals */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-check-circle" style={{ color: '#f59e0b', marginRight: '8px' }}></i>
                Pending Approvals
              </h2>
              <button className="view-all-btn" onClick={() => navigate('/app/approvals')}>
                View All <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="approvals-list">
              {dashboardData.pendingApprovals.map(approval => (
                <div key={approval.id} className="approval-item">
                  <div className="approval-info-compact">
                    <div className="control-badge">{approval.control}</div>
                    <div className="approval-details">
                      <div className="approval-title">{approval.title}</div>
                      <div className="approval-meta">
                        By {approval.submittedBy} • {approval.submittedDate}
                      </div>
                      <div className="approval-evidence">
                        <i className="fas fa-paperclip"></i> {approval.evidenceCount} files
                      </div>
                    </div>
                  </div>
                  <button className="btn-approve-small">
                    <i className="fas fa-check"></i> Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Progress */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Department Progress</h2>
          </div>
          <div className="progress-summary">
            <div className="progress-stat">
              <div className="progress-value">{dashboardData.departmentProgress.completed}</div>
              <div className="progress-label">Completed</div>
            </div>
            <div className="progress-stat">
              <div className="progress-value progress-in-progress">{dashboardData.departmentProgress.inProgress}</div>
              <div className="progress-label">In Progress</div>
            </div>
            <div className="progress-stat">
              <div className="progress-value progress-not-started">{dashboardData.departmentProgress.notStarted}</div>
              <div className="progress-label">Not Started</div>
            </div>
            <div className="progress-stat">
              <div className="progress-value progress-total">{dashboardData.departmentProgress.total}</div>
              <div className="progress-label">Total Tasks</div>
            </div>
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
            <button className="quick-action-card" onClick={() => navigate('/app/approvals')}>
              <i className="fas fa-check-circle"></i>
              <span>Review Team Work</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/assessments')}>
              <i className="fas fa-clipboard-check"></i>
              <span>Complete Assessment</span>
            </button>
            <button className="quick-action-card" onClick={() => navigate('/app/evidence')}>
              <i className="fas fa-file-upload"></i>
              <span>Upload Evidence</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;