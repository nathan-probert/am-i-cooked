import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Results.css';

interface Analysis {
  isCooked: boolean;
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  confidenceScore: number;
}

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const analysis = location.state?.analysis as Analysis;

  if (!analysis) {
    return (
      <div className="page">
        <h1>Error</h1>
        <p>No analysis results found. Please take the survey first.</p>
        <button 
          className="redirect-button"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const cookedScore = 100 - analysis.confidenceScore;

  return (
    <div className="results-page">
      <h1>Your Results</h1>
      
      <div className="results-container">
        <div className="status-section">
          <h2>Status: {analysis.isCooked ? "You're Cooked! 🔥" : "You're Ready! 🚀"}</h2>
          <div className="cooked-meter">
            <div 
              className="cooked-fill"
              style={{ width: `${cookedScore}%` }}
            />
            <span>Cooked Level: {cookedScore}%</span>
          </div>
        </div>

        <div className="assessment-section">
          <h3>Overall Assessment</h3>
          <p>{analysis.overallAssessment}</p>
        </div>

        <div className="details-section">
          <div className="strengths">
            <h3>Key Strengths</h3>
            <ul>
              {analysis.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="improvements">
            <h3>Areas for Improvement</h3>
            <ul>
              {analysis.areasForImprovement.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="recommendations-section">
          <h3>Recommendations</h3>
          <ul>
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      <button 
        className="redirect-button"
        onClick={() => navigate('/')}
      >
        Try Again
      </button>
    </div>
  );
};

export default Results; 