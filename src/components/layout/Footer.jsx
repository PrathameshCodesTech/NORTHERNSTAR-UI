import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <div className="footer-northstar-icon">
              <i className="fas fa-star"></i>
            </div>
            <span className="footer-brand">AuditSmart</span>
          </div>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} AuditSmart. All rights reserved.</p>
        </div>
        <div className="footer-right">
          <a href="#privacy">Privacy Policy</a>
          <span className="footer-divider">|</span>
          <a href="#terms">Terms of Service</a>
          <span className="footer-divider">|</span>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;