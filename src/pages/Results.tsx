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

  return (
    <div className="results-page">
      <div className="cards-container">
        <div className="card meter-card">
          <h1>Your Results</h1>
          <div className="status-section">
            <h2>Cooked-O-Meter</h2>
            <div className="doneness-scale">
              <div className="scale-segments">
                <div className="segment raw">Raw</div>
                <div className="segment rare">Rare</div>
                <div className="segment medium-rare">Med Rare</div>
                <div className="segment medium">Medium</div>
                <div className="segment medium-well">Med Well</div>
                <div className="segment well-done">Well Done</div>
                <div className="segment burnt">Burnt</div>
              </div>
              <div 
                className="scale-pointer"
                style={{ 
                  left: `${analysis.confidenceScore >= 95 ? 92.86 :
                         analysis.confidenceScore >= 85 ? 78.57 :
                         analysis.confidenceScore >= 70 ? 64.29 :
                         analysis.confidenceScore >= 55 ? 50 :
                         analysis.confidenceScore >= 40 ? 35.71 :
                         analysis.confidenceScore >= 25 ? 21.43 :
                         7.14}%` 
                }}
              >▲</div>
            </div>
            <p className="doneness-level">
              {
               analysis.confidenceScore >= 95 ? "You're beyond cooked... might be time for a career pivot. 🔥💀" :
               analysis.confidenceScore >= 85 ? "You're done for buddy. Plenty of fish in the sea, but I think you've run out of bait. 🎣❌" :
               analysis.confidenceScore >= 70 ? "Pretty cooked. You're not a complete failure... 🥩😅" :
               analysis.confidenceScore >= 55 ? "Kind of cooked. I've seen worse, but I've definitely seen better too. 🍖" :
               analysis.confidenceScore >= 40 ? "Not too cooked. Plenty of fish in the sea, just give it time. ⏳" :
               analysis.confidenceScore >= 25 ? "Not that cooked. Give it a couple days, you'll find a job. 💼" :
               "Buddy get off my site, you'll be fine! 😎"}
            </p>
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