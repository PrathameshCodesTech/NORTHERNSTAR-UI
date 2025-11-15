import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <>
      {/* Gradient Banner */}
      <div className="gradient-banner">
        <div className="banner-content">
          <div className="banner-left">
            <h1>Boeing</h1>
            <div className="banner-subtitle">
              Quality Management System Audit
              <span className="info-icon">i</span>
            </div>
          </div>
          <div className="banner-right">
            <div className="boeing-logo">BOEING</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;