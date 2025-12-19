// src/pages/TeamSetup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../contexts/OnboardingContext';
import './TeamSetup.css';

const TeamSetup = () => {
  const navigate = useNavigate();
  const { onboardingData, updateOnboardingData } = useOnboarding();
  
  // Initialize emails from context or start with one empty field
  const [emails, setEmails] = useState(
    onboardingData.teammate_emails.length > 0 
      ? onboardingData.teammate_emails 
      : ['']
  );
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
    
    // Clear error for this field
    if (errors[index]) {
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
      
      // Clear error for this field
      if (errors[index]) {
        const newErrors = { ...errors };
        delete newErrors[index];
        setErrors(newErrors);
      }
    }
  };

  const validateAllEmails = () => {
    const newErrors = {};
    let hasError = false;

    emails.forEach((email, index) => {
      if (email.trim() && !validateEmail(email)) {
        newErrors[index] = 'Invalid email format';
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleContinue = () => {
    if (validateAllEmails()) {
      // Filter out empty emails and save valid ones
      const validEmails = emails.filter(e => e.trim() && validateEmail(e));
      
      updateOnboardingData({
        teammate_emails: validEmails
      });
      
      navigate('/pricing');
    }
  };

  const handleSkip = () => {
    // Save empty array and proceed
    updateOnboardingData({
      teammate_emails: []
    });
    
    navigate('/pricing');
  };

  return (
    <div className="team-setup-container">
      <div className="team-setup-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="team-setup-title">Set up your team</h3>
      </div>

      <div className="team-setup-content">
        <h1 className="team-main-title">
          Add teammates to {onboardingData.company_name || 'your workspace'}
        </h1>

        <div className="email-inputs-container">
          {emails.map((email, index) => (
            <div key={index} className="email-input-wrapper">
              <i className="fas fa-envelope email-icon"></i>
              <input
                type="email"
                className={`email-input ${errors[index] ? 'error' : ''}`}
                placeholder="teammate@company.com"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
              />
              {emails.length > 1 && (
                <button 
                  className="remove-email-btn"
                  onClick={() => removeEmailField(index)}
                  type="button"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
              {errors[index] && (
                <p className="email-error">{errors[index]}</p>
              )}
            </div>
          ))}
          
          <button className="add-more-btn" onClick={addEmailField}>
            <i className="fas fa-plus"></i> Add another email
          </button>
        </div>

        <div className="team-setup-actions">
          <button className="skip-btn" onClick={handleSkip}>
            Skip for now
          </button>
          <button className="team-continue-btn" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSetup;