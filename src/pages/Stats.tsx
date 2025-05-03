import React from 'react';
import { useNavigate } from 'react-router-dom';

const Stats = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Survey Statistics</h1>
      <p>View aggregated statistics from all survey responses</p>
      <div className="stats-container">
        <p>Coming soon! 📊</p>
      </div>
      <button 
        className="redirect-button"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Stats; 