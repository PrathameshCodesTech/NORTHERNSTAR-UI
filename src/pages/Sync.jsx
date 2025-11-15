import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sync.css';

const Sync = () => {
  const navigate = useNavigate();

  return (
    <div className="sync-container">
     <div className="progress-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h3 className="step-title">Keeps everyone in sync</h3>
      </div>

      <div className="sync-content">
        <div className="sync-left">
          <p className="how-it-works">HOW IT WORKS</p>
          <h1 className="sync-title">
            Everyone can<br />
            easily update<br />
            their status
          </h1>
          <button className="continue-btn" onClick={() => navigate('/overview')}>
            Continue
          </button>
        </div>

        <div className="sync-right">
          <div className="board-preview">
            <div className="board-header">
              <div className="board-avatar"></div>
              <div className="board-title-section">
                <i className="fas fa-certificate board-icon"></i>
                <span className="board-name">Quality Audits</span>
              </div>
              <div className="board-members">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="member-circle" style={{
                    background: `linear-gradient(135deg, 
                      ${['#0d9488', '#14b8a6', '#10b981', '#22d3ee', '#06b6d4'][item - 1]} 0%, 
                      ${['#14b8a6', '#10b981', '#22d3ee', '#06b6d4', '#3b82f6'][item - 1]} 100%)`
                  }}></div>
                ))}
                <div className="add-member">+</div>
              </div>
            </div>

            <div className="board-columns">
              <div className="board-column">
                <div className="column-header">
                  <i className="fas fa-list-check column-icon"></i>
                  <span className="column-title">To do</span>
                </div>
                <div className="task-card">
                  <div className="task-title">Review safety protocols for Q1</div>
                  <div className="task-footer">
                    <div className="task-icons">
                      <i className="fas fa-paperclip"></i>
                      <i className="fas fa-comment"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="board-column">
                <div className="column-header">
                  <i className="fas fa-spinner column-icon"></i>
                  <span className="column-title">In Progress</span>
                </div>
                <div className="task-card-placeholder">
                  <span className="add-task-text">Add task</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sync;