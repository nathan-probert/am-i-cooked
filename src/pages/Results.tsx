import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './Results.css';

interface Analysis {
  isCooked: boolean;
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  cookedPercentage: number;
}

const ScrollIndicator = () => (
  <div className="scroll-indicator">↓</div>
);

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const analysis = location.state?.analysis as Analysis;
  const cookedPercentage = 100 - analysis.cookedPercentage;
  const [showShareMessage, setShowShareMessage] = useState(false);

  const handleShare = () => {
    // Create a shareable message with the cooked percentage
    const shareableMessage = `I was ${cookedPercentage}% cooked! 😱😱😱
Try the Cooked-O-Meter here: https://am-i-cooked-zeta.vercel.app/`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareableMessage).then(() => {
      setShowShareMessage(true);
      setTimeout(() => setShowShareMessage(false), 3000);
    });
  };

  useEffect(() => {
    // Check if there's data in the URL when the component mounts
    const searchParams = new URLSearchParams(window.location.search);
    const data = searchParams.get('data');
    if (data && !analysis) {
      try {
        const decodedAnalysis = JSON.parse(decodeURIComponent(data));
        location.state = { analysis: decodedAnalysis };
      } catch (error) {
        console.error('Error parsing shared data:', error);
      }
    }

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
      <button
        className="home-button"
        onClick={() => navigate('/')}
        title="Home"
        style={{ background: 'transparent', border: 'none' }}
      >
        <FaHome />
      </button>
      <div className="cards-container">
        <div className="card meter-card">
          <h1>Your Results</h1>
          <div className="status-section">
            <h2>Cooked-O-Meter</h2>
            <div className="doneness-scale">
              <div className="scale-segments">
                <div className={`segment raw ${cookedPercentage < 15 ? 'active' : ''}`}>Raw</div>
                <div className={`segment rare ${cookedPercentage >= 15 && cookedPercentage < 30 ? 'active' : ''}`}>Rare</div>
                <div className={`segment medium-rare ${cookedPercentage >= 30 && cookedPercentage < 45 ? 'active' : ''}`}>Med Rare</div>
                <div className={`segment medium ${cookedPercentage >= 45 && cookedPercentage < 60 ? 'active' : ''}`}>Medium</div>
                <div className={`segment medium-well ${cookedPercentage >= 60 && cookedPercentage < 75 ? 'active' : ''}`}>Med Well</div>
                <div className={`segment well-done ${cookedPercentage >= 75 && cookedPercentage < 90 ? 'active' : ''}`}>Well Done</div>
                <div className={`segment burnt ${cookedPercentage >= 90 ? 'active' : ''}`}>Burnt</div>
              </div>
              <div
                className="scale-pointer"
                style={{
                  left: `${cookedPercentage >= 90 ? 92.86 :
                    cookedPercentage >= 75 ? 78.57 :
                      cookedPercentage >= 60 ? 64.29 :
                        cookedPercentage >= 45 ? 50 :
                          cookedPercentage >= 30 ? 35.71 :
                            cookedPercentage >= 15 ? 21.43 :
                              7.14}%`
                }}
              >▲</div>
            </div>
            <p className="doneness-level">
              {
                cookedPercentage >= 90 ? "You're beyond cooked... might be time for a career pivot. 🔥💀" :
                  cookedPercentage >= 75 ? "You're done for buddy. Plenty of fish in the sea, but I think you've run out of bait. 🎣❌" :
                    cookedPercentage >= 60 ? "Pretty cooked. You're not a complete failure... 🥩😅" :
                      cookedPercentage >= 45 ? "Kind of cooked. I've seen worse, but I've definitely seen better too. 🍖" :
                        cookedPercentage >= 30 ? "Not too cooked. Plenty of fish in the sea, just give it time. ⏳" :
                          cookedPercentage >= 15 ? "Not that cooked. Give it a couple days, you'll find a job. 💼" :
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

        <div className="card strengths-card">
          <div className="strengths-section">
            <h3>Key Strengths</h3>
            <ul>
              {analysis.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <ScrollIndicator />
        </div>

        <div className="card improvements-card">
          <div className="improvements-section">
            <h3>Areas for Improvement</h3>
            <ul>
              {analysis.areasForImprovement.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
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
          <div className="button-group">
            <button
              className="redirect-button"
              onClick={() => navigate('/')}
            >
              Try Again
            </button>
            <button
              className="redirect-button share-button"
              onClick={handleShare}
            >
              Share Results
            </button>
          </div>
          {showShareMessage && (
            <div className="share-message">
              Link copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Results;