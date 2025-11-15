import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamSetup.css';

const TeamSetup = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState(['']);
  const [inviteLink] = useState('https://auditsmart.app/invite/abc123xyz');

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  const handleContinue = () => {
    navigate('/pricing');
  };

  const handleSkip = () => {
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
        <h1 className="team-main-title">Add your teammates</h1>

        <div className="email-inputs-container">
          {emails.map((email, index) => (
            <div key={index} className="email-input-wrapper">
              <i className="fas fa-envelope email-icon"></i>
              <input
                type="email"
                className="email-input"
                placeholder="teammate@company.com"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
              />
            </div>
          ))}
          
          <button className="add-more-btn" onClick={addEmailField}>
            <i className="fas fa-plus"></i> Add another email
          </button>
        </div>

        <div className="invite-link-section">
          <button className="copy-link-btn" onClick={copyInviteLink}>
            <i className="fas fa-copy"></i>
            Copy invite link to clipboard
          </button>
        </div>

        <div className="team-setup-actions">
          <button className="skip-btn" onClick={handleSkip}>
            Skip
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