import React from 'react';
import { useNavigate } from 'react-router-dom';

const Resume: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="resume-page">
      <h1>Resume Upload</h1>
      <p>Upload your resume to find out if you're cooked!</p>
      <button
        className="redirect-button"
        onClick={() => navigate('/results')}
      >
        Analyze Resume
      </button>
    </div>
  );
};

export default Resume;