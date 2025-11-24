// src/tenant/settings/UserManagement.jsx
import React, { useState } from 'react';
import EmptyState from '../components/EmptyState';
import './UserManagement.css';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Mock data
  const users = [
    {
      id: 'u1',
      name: 'John Doe',
      email: 'john@acmecorp.com',
      role: 'TENANT_ADMIN',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=14b8a6&color=fff',
      joined_date: '2025-01-15',
      last_active: '2 hours ago',
      assignments: 12
    },
    {
      id: 'u2',
      name: 'Sarah Chen',
      email: 'sarah@acmecorp.com',
      role: 'COMPLIANCE_MANAGER',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=3b82f6&color=fff',
      joined_date: '2025-01-18',
      last_active: '5 hours ago',
      assignments: 28
    },
    {
      id: 'u3',
      name: 'Mike Smith',
      email: 'mike@acmecorp.com',
      role: 'EMPLOYEE',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Smith&background=10b981&color=fff',
      joined_date: '2025-01-20',
      last_active: '1 day ago',
      assignments: 15
    },
    {
      id: 'u4',
      name: 'Emily Johnson',
      email: 'emily@acmecorp.com',
      role: 'MANAGER',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Johnson&background=f59e0b&color=fff',
      joined_date: '2025-01-22',
      last_active: '3 hours ago',
      assignments: 8
    },
    {
      id: 'u5',
      name: 'David Wilson',
      email: 'david@acmecorp.com',
      role: 'AUDITOR',
      status: 'invited',
      avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=8b5cf6&color=fff',
      joined_date: null,
      last_active: 'Never',
      assignments: 0
    }
  ];

  const roles = [
    { value: 'TENANT_ADMIN', label: 'Tenant Admin', color: '#ef4444', description: 'Full access to all features' },
    { value: 'COMPLIANCE_MANAGER', label: 'Compliance Manager', color: '#3b82f6', description: 'Manage compliance work' },
    { value: 'MANAGER', label: 'Manager', color: '#f59e0b', description: 'Approve team submissions' },
    { value: 'EMPLOYEE', label: 'Employee', color: '#10b981', description: 'Complete assignments' },
    { value: 'AUDITOR', label: 'Auditor', color: '#8b5cf6', description: 'View and audit compliance' }
  ];

  const getRoleStyle = (role) => {
    const roleConfig = roles.find(r => r.value === role);
    return { color: roleConfig?.color || '#6b7280', label: roleConfig?.label || role };
  };

  const getStatusStyle = (status) => {
    const styles = {
      active: { bg: '#d1fae5', color: '#065f46', label: 'Active', icon: 'fa-check-circle' },
      invited: { bg: '#fef3c7', color: '#92400e', label: 'Invited', icon: 'fa-envelope' },
      inactive: { bg: '#f3f4f6', color: '#6b7280', label: 'Inactive', icon: 'fa-ban' }
    };
    return styles[status] || styles.active;
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    invited: users.filter(u => u.status === 'invited').length
  };

  return (
    <div className="user-management-page">
{/* Clean Page Header */}
      <div className="page-header-settings">
        <div className="header-content">
          <div className="header-left">
            <h1>Team Members</h1>
            <p className="header-subtitle">
              Manage your team members and their roles
            </p>
          </div>
          <div className="header-action">
            <button className="invite-user-btn" onClick={() => setShowInviteModal(true)}>
              <i className="fas fa-user-plus"></i>
              Invite User
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="user-management-content">
        {/* Stats */}
        <div className="user-stats-grid">
          <div className="user-stat-card">
            <i className="fas fa-users" style={{ color: '#3b82f6' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="user-stat-card">
            <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
          <div className="user-stat-card">
            <i className="fas fa-envelope" style={{ color: '#f59e0b' }}></i>
            <div className="stat-info">
              <span className="stat-value">{stats.invited}</span>
              <span className="stat-label">Invited</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="user-filters">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Role:</label>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Assignments</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const roleStyle = getRoleStyle(user.role);
                  const statusStyle = getStatusStyle(user.status);

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <img src={user.avatar} alt={user.name} className="user-avatar-small" />
                          <div className="user-info-cell">
                            <span className="user-name-cell">{user.name}</span>
                            <span className="user-email-cell">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="role-badge"
                          style={{ backgroundColor: `${roleStyle.color}15`, color: roleStyle.color }}
                        >
                          {roleStyle.label}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="status-badge-table"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                        >
                          <i className={`fas ${statusStyle.icon}`}></i>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td>
                        <span className="assignments-count">{user.assignments}</span>
                      </td>
                      <td>
                        <span className="last-active">{user.last_active}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn-table edit" title="Edit">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="action-btn-table delete" title="Remove">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="fa-users"
            title="No users found"
            description="Try adjusting your search or filter criteria"
          />
        )}

        {/* Roles Info Section */}
        <div className="roles-info-section">
          <h3>User Roles & Permissions</h3>
          <div className="roles-grid">
            {roles.map(role => (
              <div key={role.value} className="role-info-card">
                <div className="role-header-card">
                  <div 
                    className="role-icon"
                    style={{ backgroundColor: `${role.color}15` }}
                  >
                    <i className="fas fa-user" style={{ color: role.color }}></i>
                  </div>
                  <h4 style={{ color: role.color }}>{role.label}</h4>
                </div>
                <p className="role-description">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal Placeholder */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invite Team Member</h2>
              <button className="close-btn" onClick={() => setShowInviteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="user@company.com" className="form-input" />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="form-input">
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  placeholder="Add a personal message to the invitation..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowInviteModal(false)}>
                Cancel
              </button>
              <button className="submit-btn">
                <i className="fas fa-paper-plane"></i>
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;