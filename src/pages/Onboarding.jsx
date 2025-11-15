import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleSelection = (type) => {
    setSelected(type);
    // Navigate after a short delay
    setTimeout(() => {
      navigate('/workspace-name');
    }, 500);
  };

  return (
    <div className="onboarding-container">
      <button className="back-btn-onboarding" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i>
      </button>
      <div className="onboarding-content">
        <h1 className="onboarding-title">
          Hey, how do you plan to use AuditSmart?
        </h1>

        <p className="onboarding-subtitle">
          We'll streamline your setup experience accordingly
        </p>

        <div className="options-container">
          <div
            className={`option-card ${selected === 'solo' ? 'selected' : ''}`}
            onClick={() => handleSelection('solo')}
          >
            <div className="icon-container">
              <div className="circle-icon single"></div>
            </div>
            <h3 className="option-title">Just me</h3>
            <p className="option-description">
              Easily manage your audits, compliance
              <br />
              checks and everything in between
            </p>
          </div>

          <div
            className={`option-card ${selected === 'team' ? 'selected' : ''}`}
            onClick={() => handleSelection('team')}
          >
            <div className="icon-container">
              <div className="circle-icon team-main"></div>
              <div className="circle-icon team-left"></div>
              <div className="circle-icon team-right"></div>
            </div>
            <h3 className="option-title">With my team</h3>
            <p className="option-description">
              Easily manage your team's audits with
              <br />
              project boards, tasks, chat & more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;