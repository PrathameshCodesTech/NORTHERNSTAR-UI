// src/tenant/layouts/TenantLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TenantSidebar from './TenantSidebar';
import './TenantLayout.css';

const TenantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock employees with different roles
  const mockEmployees = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@acmecorp.com',
      role: 'TENANT_ADMIN',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=14b8a6&color=fff'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@acmecorp.com',
      role: 'COMPLIANCE_MANAGER',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@acmecorp.com',
      role: 'MANAGER',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=22d3ee&color=fff'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@acmecorp.com',
      role: 'EMPLOYEE',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=06b6d4&color=fff'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david@acmecorp.com',
      role: 'AUDITOR',
      avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=3b82f6&color=fff'
    }
  ];

  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEmployeeChange = (employee) => {
    setSelectedEmployee(employee);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="tenant-layout">
      {/* Gradient Header */}
      <div className="tenant-top-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'}`}></i>
          </button>

          {/* Employee Dropdown */}
          <div className="employee-dropdown-wrapper">
            <button className="employee-dropdown-btn" onClick={toggleDropdown}>
              <img 
                src={selectedEmployee.avatar} 
                alt={selectedEmployee.name} 
                className="employee-avatar" 
              />
              <div className="employee-info">
                <span className="employee-name">{selectedEmployee.name}</span>
                <span className="employee-role">
                  {selectedEmployee.role.replace(/_/g, ' ')}
                </span>
              </div>
              <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="employee-dropdown-menu">
                <div className="dropdown-header">Switch Employee View</div>
                {mockEmployees.map(employee => (
                  <button
                    key={employee.id}
                    className={`dropdown-item ${selectedEmployee.id === employee.id ? 'active' : ''}`}
                    onClick={() => handleEmployeeChange(employee)}
                  >
                    <img 
                      src={employee.avatar} 
                      alt={employee.name} 
                      className="dropdown-avatar" 
                    />
                    <div className="dropdown-employee-info">
                      <span className="dropdown-name">{employee.name}</span>
                      <span className="dropdown-role">
                        {employee.role.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {selectedEmployee.id === employee.id && (
                      <i className="fas fa-check"></i>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Company Name */}
        {/* Company Name */}
        <div className="header-right">
          <div className="company-header-text">
            <span className="company-name">AcmeCorp</span>
            <span className="separator">|</span>
            <span className="company-brand">BOEING</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="tenant-content-wrapper">
        {/* Sidebar */}
        <TenantSidebar isOpen={sidebarOpen} currentUser={selectedEmployee} />

        {/* Page Content */}
        {/* Page Content */}
        <div className={`tenant-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <Outlet context={{ currentUser: selectedEmployee }} />

          {/* Footer inside tenant layout */}
          <footer className="tenant-footer">
            <div className="tenant-footer-content">
              <div className="footer-left">
                <div className="footer-logo">
                  <div className="footer-star-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <span className="footer-brand">NorthStar Compliance</span>
                </div>
                <p className="footer-copyright">
                  &copy; {new Date().getFullYear()} NorthStar Compliance. All rights reserved.
                </p>
              </div>
              <div className="footer-right">
                <a href="#privacy">Privacy Policy</a>
                <span className="footer-divider">|</span>
                <a href="#terms">Terms of Service</a>
                <span className="footer-divider">|</span>
                <a href="#contact">Contact Support</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TenantLayout;