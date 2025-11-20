// src/admin/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      {isOpen && <div className="sidebar-backdrop" onClick={closeSidebar}></div>}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-icon">
              <i className="fas fa-star"></i>
            </div>
            <span className="sidebar-brand">AuditSmart</span>
          </div>
          
          <button className="sidebar-close-btn" onClick={closeSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <p className="sidebar-subtitle">Admin Panel</p>

        <nav className="sidebar-nav">
          {/* ✅ RESTORED: Framework Management Section */}
          <div className="nav-section">
            <h3 className="nav-section-title">Framework Management</h3>
            
            <NavLink to="/admin/frameworks" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-folder-tree"></i>
              <span>Frameworks</span>
            </NavLink>
            
            {/* ✅ RESTORED: Global list views */}
            <NavLink to="/admin/domains" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-layer-group"></i>
              <span>All Domains</span>
            </NavLink>
            
            <NavLink to="/admin/categories" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-tags"></i>
              <span>All Categories</span>
            </NavLink>
            
            <NavLink to="/admin/subcategories" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-sitemap"></i>
              <span>All Subcategories</span>
            </NavLink>
            
            <NavLink to="/admin/controls" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-shield-halved"></i>
              <span>All Controls</span>
            </NavLink>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Assessment</h3>
            
            <NavLink to="/admin/questions" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-circle-question"></i>
              <span>Questions</span>
            </NavLink>
            
            <NavLink to="/admin/evidence" className="nav-link" onClick={closeSidebar}>
              <i className="fas fa-file-lines"></i>
              <span>Evidence</span>
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/" className="nav-link" onClick={closeSidebar}>
            <i className="fas fa-arrow-left"></i>
            <span>Back to Home</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;