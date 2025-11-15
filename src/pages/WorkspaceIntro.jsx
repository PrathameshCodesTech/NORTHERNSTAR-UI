import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkspaceIntro.css';

const WorkspaceIntro = () => {
  const navigate = useNavigate();

  const teams = [
    { name: 'Quality Audits', icon: 'fa-certificate', members: 4 },
    { name: 'Compliance', icon: 'fa-clipboard-check', members: 6 },
    { name: 'Safety', icon: 'fa-shield-halved', members: 3 },
    { name: 'Internal Review', icon: 'fa-scale-balanced', members: 2 },
    { name: 'Certifications', icon: 'fa-medal', members: 4 },
    { name: 'Documentation', icon: 'fa-folder-open', members: 3 }
  ];

  return (
    <div className="workspace-intro-container">
      <div className="progress-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="step-title">Welcome to AuditSmart Workspace</h3>
      </div>


      <div className="workspace-intro-content">
        <div className="intro-left">
          <p className="how-it-works">HOW IT WORKS</p>
          <h1 className="intro-title">
            In your workspace<br />
            each audit, project<br />
            or process gets a<br />
            board
          </h1>
          <button className="continue-btn" onClick={() => navigate('/templates')}>
            Continue
          </button>
        </div>

        <div className="intro-right">
          {teams.map((team, index) => (
            <div key={index} className="team-item">
              <i className={`fas ${team.icon} team-icon`}></i>
              <span className="team-name">{team.name}</span>
              <div className="team-members">
                {[...Array(team.members)].map((_, i) => (
                  <div key={i} className="member-avatar" style={{
                    background: `linear-gradient(135deg, 
                      ${['#0d9488', '#14b8a6', '#10b981', '#22d3ee', '#06b6d4', '#3b82f6'][i % 6]} 0%, 
                      ${['#14b8a6', '#10b981', '#22d3ee', '#06b6d4', '#3b82f6', '#0d9488'][i % 6]} 100%)`
                  }}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceIntro;