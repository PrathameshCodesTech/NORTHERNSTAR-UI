// src/tenant/layouts/TenantSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './TenantSidebar.css';

const TenantSidebar = ({ isOpen, currentUser }) => {
  // Navigation items based on roles
  const navItems = {
    common: [
      { path: '/app/dashboard', icon: 'fa-home', label: 'Dashboard', roles: ['all'] },
      { path: '/app/frameworks', icon: 'fa-shield-halved', label: 'My Frameworks', roles: ['all'] },
    ],
    
    compliance: [
      { 
        path: '/app/assignments', 
        icon: 'fa-tasks', 
        label: 'My Assignments',
        roles: ['EMPLOYEE', 'MANAGER', 'COMPLIANCE_MANAGER', 'TENANT_ADMIN']
      },
      { 
        path: '/app/assessments', 
        icon: 'fa-clipboard-question', 
        label: 'Assessments',
        roles: ['EMPLOYEE', 'COMPLIANCE_MANAGER', 'TENANT_ADMIN']
      },
      { 
        path: '/app/approvals', 
        icon: 'fa-check-circle', 
        label: 'Approvals',
        roles: ['MANAGER', 'COMPLIANCE_MANAGER', 'TENANT_ADMIN']
      },
      { 
        path: '/app/evidence', 
        icon: 'fa-file-upload', 
        label: 'Evidence',
        roles: ['EMPLOYEE', 'COMPLIANCE_MANAGER', 'AUDITOR', 'TENANT_ADMIN']
      },
    ],
    
    reports: [
      { 
        path: '/app/reports', 
        icon: 'fa-chart-line', 
        label: 'Reports',
        roles: ['AUDITOR', 'COMPLIANCE_MANAGER', 'TENANT_ADMIN']
      },
      { 
        path: '/app/audit-trail', 
        icon: 'fa-history', 
        label: 'Audit Trail',
        roles: ['AUDITOR', 'COMPLIANCE_MANAGER', 'TENANT_ADMIN']
      },
    ],
    
    settings: [
      { 
        path: '/app/settings/users', 
        icon: 'fa-users', 
        label: 'Team Members',
        roles: ['TENANT_ADMIN']
      },
      { 
        path: '/app/settings/subscription', 
        icon: 'fa-credit-card', 
        label: 'Subscription',
        roles: ['TENANT_ADMIN']
      },
      { 
        path: '/app/settings/frameworks', 
        icon: 'fa-cog', 
        label: 'Framework Settings',
        roles: ['TENANT_ADMIN']
      },
    ],
  };

  const canAccessRoute = (allowedRoles) => {
    if (allowedRoles.includes('all')) return true;
    return allowedRoles.includes(currentUser.role);
  };

  return (
    <div className={`tenant-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        {/* Common Section */}
        <div className="sidebar-section">
          <nav className="sidebar-nav">
            {navItems.common.map(item => 
              canAccessRoute(item.roles) && (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              )
            )}
          </nav>
        </div>

        {/* Compliance Section */}
        {navItems.compliance.some(item => canAccessRoute(item.roles)) && (
          <div className="sidebar-section">
            <div className="section-title">Compliance Work</div>
            <nav className="sidebar-nav">
              {navItems.compliance.map(item => 
                canAccessRoute(item.roles) && (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                )
              )}
            </nav>
          </div>
        )}

        {/* Reports Section */}
        {navItems.reports.some(item => canAccessRoute(item.roles)) && (
          <div className="sidebar-section">
            <div className="section-title">Reports & Audit</div>
            <nav className="sidebar-nav">
              {navItems.reports.map(item => 
                canAccessRoute(item.roles) && (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                )
              )}
            </nav>
          </div>
        )}

        {/* Settings Section */}
        {navItems.settings.some(item => canAccessRoute(item.roles)) && (
          <div className="sidebar-section">
            <div className="section-title">Settings</div>
            <nav className="sidebar-nav">
              {navItems.settings.map(item => 
                canAccessRoute(item.roles) && (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  >
                    <i className={`fas ${item.icon}`}></i>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                )
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="company-badge">
          <i className="fas fa-building"></i>
          <div className="company-info">
            <span className="company-name">AcmeCorp</span>
            <span className="plan-name">Professional Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantSidebar;