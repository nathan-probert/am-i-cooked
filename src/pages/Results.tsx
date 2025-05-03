import React, { useEffect, useRef } from 'react';
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

const ScrollIndicator = () => (
  <div className="scroll-indicator">↓</div>
);

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const analysis = location.state?.analysis as Analysis;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '-50px'
      }
    );

    document.querySelectorAll('.card').forEach(card => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

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
          </div>
          <ScrollIndicator />
        </div>

        <div className="card assessment-card">
          <div className="assessment-section">
            <h3>Overall Assessment</h3>
            <p>{analysis.overallAssessment}</p>
          </div>
          <ScrollIndicator />
        </div>

        <div className="card details-card">
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
          <ScrollIndicator />
        </div>

        <div className="card recommendations-card">
          <div className="recommendations-section">
            <h3>Recommendations</h3>
            <ul>
              {analysis.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
          <ScrollIndicator />
        </div>

        <div className="card action-card">
          <button 
            className="redirect-button"
            onClick={() => navigate('/')}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results; 