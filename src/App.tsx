import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Survey from './pages/Survey'
import Resume from './pages/Resume'
import Results from './pages/Results'
import Stats from './pages/Stats'

// Separate component for the home page content
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Am I Cooked?</h1>
        <p className="sub-header">Find out how realistic (or unrealistic!) your career goals are!</p>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App