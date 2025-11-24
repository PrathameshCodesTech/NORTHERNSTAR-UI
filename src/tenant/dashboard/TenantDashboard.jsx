// src/tenant/dashboard/TenantDashboard.jsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import TenantAdminDashboard from './TenantAdminDashboard';
import ComplianceManagerDashboard from './ComplianceManagerDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import AuditorDashboard from './AuditorDashboard';
import './TenantDashboard.css';

const TenantDashboard = () => {
  // Get current user from TenantLayout context (we'll pass this via context)
  // For now, using mock - will be replaced with actual context
 const { currentUser } = useOutletContext();

  // Route to correct dashboard based on role
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'TENANT_ADMIN':
        return <TenantAdminDashboard currentUser={currentUser} />;
      case 'COMPLIANCE_MANAGER':
        return <ComplianceManagerDashboard currentUser={currentUser} />;
      case 'MANAGER':
        return <ManagerDashboard currentUser={currentUser} />;
      case 'EMPLOYEE':
        return <EmployeeDashboard currentUser={currentUser} />;
      case 'AUDITOR':
        return <AuditorDashboard currentUser={currentUser} />;
      default:
        return <EmployeeDashboard currentUser={currentUser} />;
    }
  };

  return renderDashboard();
};

export default TenantDashboard;