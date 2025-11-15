import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Overview.css';

const Overview = () => {
  const navigate = useNavigate();

  const tasks = [
    { title: 'Complete ISO 9001 audit documentation', status: 'In Progress', board: 'Quality Audits' },
    { title: 'Review compliance checklist', status: 'To Do', board: 'Compliance' },
    { title: 'Update safety protocols', status: 'In Progress', board: 'Safety' },
    { title: 'Schedule internal audit meeting', status: 'Backlog', board: 'Internal Review' }
  ];

  return (
    <div className="overview-container">
      <div className="progress-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="step-title">Track everyone's progress</h3>
      </div>
      <div className="overview-content">
        <div className="overview-left">
          <p className="how-it-works">HOW IT WORKS</p>
          <h1 className="overview-title">
            Get an overview<br />
            of all your team's<br />
            projects & tasks
          </h1>
          <button className="continue-btn" onClick={() => navigate('/onboarding')}>
            Continue
          </button>
        </div>

        <div className="overview-right">
          <div className="tasks-preview">
            <div className="tasks-header">
              <div className="header-avatar"></div>
              <div className="header-tab">
                <i className="fas fa-bookmark"></i>
                <span>People</span>
              </div>
              <div className="header-members">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="header-member" style={{
                    background: `linear-gradient(135deg, 
                      ${['#0d9488', '#14b8a6', '#10b981', '#22d3ee', '#06b6d4'][item - 1]} 0%, 
                      ${['#14b8a6', '#10b981', '#22d3ee', '#06b6d4', '#3b82f6'][item - 1]} 100%)`
                  }}></div>
                ))}
              </div>
            </div>

            <div className="tasks-sections">
              <div className="tasks-section">
                <div className="section-title">
                  <div className="user-icon"></div>
                  <span>Me</span>
                </div>
                {tasks.slice(0, 2).map((task, index) => (
                  <div key={index} className="task-item">
                    <div className="task-meta">
                      <span className="task-board">{task.board}</span>
                      <span className="task-status">{task.status}</span>
                    </div>
                    <div className="task-name">{task.title}</div>
                    <div className="task-icons-row">
                      <i className="fas fa-paperclip"></i>
                      <i className="fas fa-comment"></i>
                      <div className="task-assignee"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="tasks-section">
                <div className="section-title">
                  <div className="user-icon team"></div>
                  <span>Team Members</span>
                </div>
                {tasks.slice(2, 4).map((task, index) => (
                  <div key={index} className="task-item">
                    <div className="task-meta">
                      <span className="task-board">{task.board}</span>
                      <span className="task-status">{task.status}</span>
                    </div>
                    <div className="task-name">{task.title}</div>
                    <div className="task-icons-row">
                      <i className="fas fa-paperclip"></i>
                      <div className="task-assignee team"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;