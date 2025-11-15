import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkspaceName.css';

const WorkspaceName = () => {
  const [companyName, setCompanyName] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (companyName.trim()) {
      navigate('/team-setup');
    }
  };

  return (
    <div className="workspace-name-container">
  <div className="progress-header">
    <button className="back-btn" onClick={() => navigate(-1)}>
      <i className="fas fa-arrow-left"></i>
    </button>
    <h3 className="step-title">Name your workspace</h3>
  </div>


      <div className="workspace-name-content">
        <h1 className="main-question">What's your company name?</h1>
        
        <input
          type="text"
          className="company-input"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
          autoFocus
        />

        <button 
          className="continue-btn"
          onClick={handleContinue}
          disabled={!companyName.trim()}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default WorkspaceName;