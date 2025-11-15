import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Templates.css';

const Templates = () => {
  const navigate = useNavigate();

  return (
    <div className="templates-container">
      <div className="progress-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="step-title">Get started with templates</h3>
      </div>

      <div className="templates-content">
        <div className="templates-left">
          <p className="how-it-works">HOW IT WORKS</p>
          <h1 className="templates-title">
            Use +100 templates<br />
            for any audit or<br />
            compliance process
          </h1>
          <button className="continue-btn" onClick={() => navigate('/sync')}>
            Continue
          </button>
        </div>

        <div className="templates-right">
          <div className="template-cards-stack">
            {[1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={item}
                className="template-card"
                style={{
                  transform: `perspective(1000px) rotateY(${-15 + index * 2}deg) translateX(${index * 40}px) translateZ(${-index * 20}px)`,
                  zIndex: 5 - index,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="card-header" style={{
                  background: `linear-gradient(135deg, 
                    ${['#0d9488', '#14b8a6', '#10b981', '#22d3ee', '#06b6d4'][index]} 0%, 
                    ${['#14b8a6', '#10b981', '#22d3ee', '#06b6d4', '#3b82f6'][index]} 100%)`
                }}>
                  <div className="card-title">
                    {['Quality Audit', 'ISO Compliance', 'Safety Check', 'Internal Review', 'Process Audit'][index]}
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-row">
                    <i className="fas fa-circle-check card-icon"></i>
                    <span className="card-text">
                      {['12 Controls', '8 Domains', '15 Controls', '20 Questions', '18 Controls'][index]}
                    </span>
                  </div>
                  <div className="card-row">
                    <i className="fas fa-list-check card-icon"></i>
                    <span className="card-text">
                      {['24 Questions', '16 Questions', '30 Questions', '12 Evidence', '25 Questions'][index]}
                    </span>
                  </div>
                  <div className="card-row short">
                    <i className="fas fa-file-lines card-icon"></i>
                    <span className="card-text">
                      {['8 Evidence', '10 Evidence', '12 Evidence', '5 Domains', '15 Evidence'][index]}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;