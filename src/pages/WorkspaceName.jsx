// src/pages/WorkspaceName.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../contexts/OnboardingContext';
import './WorkspaceName.css';

const WorkspaceName = () => {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  
  const [companyName, setCompanyName] = useState(onboardingData.company_name || '');
  const [error, setError] = useState('');

  const validateCompanyName = () => {
    // Reset error
    setError('');

    // Check if empty
    if (!companyName.trim()) {
      setError('Company name is required');
      return false;
    }

    // Check minimum length
    if (companyName.trim().length < 2) {
      setError('Company name must be at least 2 characters');
      return false;
    }

    // Check for invalid characters
    const invalidChars = ['<', '>', '"', "'", '&'];
    const hasInvalidChar = invalidChars.some(char => companyName.includes(char));
    
    if (hasInvalidChar) {
      setError('Company name contains invalid characters');
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateCompanyName()) {
      // Save company name to context
      updateOnboardingData({
        company_name: companyName.trim()
      });
      
      // Navigate to team setup
      navigate('/team-setup');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleContinue();
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
        
        <div className="input-wrapper">
          <input
            type="text"
            className={`company-input ${error ? 'error' : ''}`}
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              setError(''); // Clear error on typing
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter company name"
            autoFocus
          />
          {error && <p className="error-message">{error}</p>}
        </div>

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