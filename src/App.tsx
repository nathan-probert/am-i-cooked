import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Survey from './pages/Survey'
import Resume from './pages/Resume'
import Results from './pages/Results'
import Stats from './pages/Stats'
import EasterEgg from './pages/EasterEgg'
import Footer from './components/Footer'

// Separate component for the home page content
const Home = () => {
  const navigate = useNavigate();
  const title = "Am I Cooked?";
  const [secretClicks, setSecretClicks] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Add window resize listener to track screen width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine if we should split the title on smaller screens
  const shouldSplitTitle = windowWidth < 500;

  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    const newClicks = secretClicks + 1;
    setSecretClicks(newClicks);
    
    if (newClicks === 5) {
      navigate('/easter-egg');
      setSecretClicks(0);
    }
  };

  return (
    <div className="hero">
      <div className="hero-content">
        {shouldSplitTitle ? (
          <div className="responsive-title">
            <h1>
              {"Am I".split('').map((char, index) => (
                <span key={index} className="trembling-letter">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
            <h1>
              {"Cooked?".split('').map((char, index) => (
                <span key={index + 5} className="trembling-letter">
                  {char}
                </span>
              ))}
            </h1>
          </div>
        ) : (
          <h1>
            {title.split('').map((char, index) => (
              <span key={index} className="trembling-letter">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        )}
        <p className="sub-header">
          Find out how realistic (or{' '}
          <span 
            onClick={handleSecretClick}
            style={{ 
              cursor: 'default',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          >
            unrealistic!
          </span>) your career goals are!
        </p>
        <div className="button-container">
          <button
            className="redirect-button"
            onClick={() => navigate('/survey')}
          >
            Take the Survey
          </button>
          <button
            className="redirect-button"
            onClick={() => navigate('/resume')}
          >
            Upload a Resume
          </button>
          <button
            className="redirect-button stats-button"
            onClick={() => navigate('/stats')}
          >
            View Stats
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/results" element={<Results />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/easter-egg" element={<EasterEgg />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App