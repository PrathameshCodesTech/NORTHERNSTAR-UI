import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">
          A simple audit system
          <br />
          to <span className="underline-text">manage it all</span>
        </h1>
        
        <p className="landing-subtitle">
          Easily manage your compliance audits, quality checks, and team's
          <br />
          workflow all in one place. Trusted by leading organizations
        </p>

        <div className="landing-cta">
          <button className="cta-button" onClick={() => navigate('/workspace-intro')}>
            Get Started for Free →
          </button>
        </div>

        <p className="free-text">FREE FOREVER. NO CREDIT CARD.</p>
      </div>
    </div>
  );
};

export default Landing;