import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Stats.css';

interface SurveyData {
  _id: string;
  jobType: string;
  salary: string;
  location: string;
  companySize: string;
  hours: string;
  industry: string;
  relocation: string;
  startTime: string;
  internships: string;
  projects: string;
  github: string;
  hackathons: string;
  leetcode: string;
  versionControl: string;
  education: string;
  gpa: string;
  applications: string;
  tailoredResume: string;
  containerization: string;
  cloud: string;
  deployment: string;
  behavioral: string;
  timestamp: string;
  __v?: number;
}

const formatLabel = (key: string): string => {
  if (key === 'gpa') return 'GPA';
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

type FrequencyData = Record<string, number>;

const colorPalette = [
  '#4285F4', '#EA4335', '#FBBC05', '#34A853',
  '#FF6D01', '#46BDC6', '#9C27B0', '#3F51B5'
];

const Stats = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fieldCategories = [
    {
      title: 'Job Details',
      icon: '💼',
      fields: ['jobType', 'salary', 'companySize', 'industry', 'location']
    },
    {
      title: 'Education & Skills',
      icon: '🎓',
      fields: ['education', 'gpa', 'versionControl', 'containerization', 'cloud', 'deployment']
    },
    {
      title: 'Experience & Activities',
      icon: '⚙️',
      fields: ['internships', 'projects', 'github', 'hackathons', 'leetcode']
    },
    {
      title: 'Job Search Strategy',
      icon: '🔍',
      fields: ['applications', 'tailoredResume', 'behavioral', 'relocation']
    },
    {
      title: 'Work Preferences',
      icon: '⏰',
      fields: ['hours', 'startTime']
    }
  ];

  const getFieldDistribution = (field: keyof SurveyData): FrequencyData => {
    return surveys.reduce((acc, survey) => {
      const value = survey[field] || 'N/A';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as FrequencyData);
  };

  useEffect(() => {
    const fetchSurveys = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/survey/stats');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: SurveyData[] = await response.json();
        setSurveys(data);
      } catch (err: any) {
        console.error("Failed to fetch surveys:", err);
        setError(err.message || 'Failed to load survey data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  if (isLoading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading survey data...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">❌</div>
      <h2>Error</h2>
      <p>{error}</p>
      <button className="retry-button" onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="page stats-page">
      <header className="stats-header">
        <h1 style={{ color: "black" }}>📊 Survey Statistics</h1>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </header>

      <div className="key-metrics">
        <div className="metrics-grid">
          <div className="metric-card total-responses">
            <div className="metric-icon-container">
              <span className="metric-icon">📋</span>
            </div>
            <div className="metric-content">
              <div className="metric-text">
                <p className="metric-label">Total Survey Responses</p>
                <p className="metric-value">{surveys.length}</p>
              </div>
              <div className="metric-trend">
                <span className="trend-icon">📈</span>
                <span className="trend-text">All Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="category-grid">
        {fieldCategories.map((category) => (
          <div key={category.title} className="category-card">
            <div className="category-header">
              <h2>{category.title}</h2>
              <div className="category-divider"></div>
            </div>
            <div className="category-fields-grid">
              {category.fields.map((field) => {
                const data = getFieldDistribution(field as keyof SurveyData);
                const total = Object.values(data).reduce((sum, count) => sum + count, 0);
                let startAngle = 0;

                return (
                  <div key={field} className="field-card">
                    <div className="field-header">
                      <h3>{formatLabel(field)}</h3>
                      <span className="response-count">{total} responses</span>
                    </div>
                    <div className="chart-container">
                      <svg viewBox="0 0 100 100" className="pie-chart">
                        {Object.entries(data).map(([label, count], index) => {
                          const percentage = count / total;
                          const angle = percentage * 360;
                          const endAngle = startAngle + angle;

                          // Path calculation
                          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                          const largeArcFlag = angle > 180 ? 1 : 0;
                          const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                          const element = (
                            <path
                              key={label}
                              d={pathData}
                              fill={colorPalette[index % colorPalette.length]}
                              stroke="#fff"
                              strokeWidth="0.5"
                            />
                          );

                          startAngle = endAngle;
                          return element;
                        })}
                      </svg>
                      <div className="chart-legend">
                        {Object.entries(data).map(([label, count], index) => (
                          <div key={label} className="legend-item">
                            <span
                              className="legend-color"
                              style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                            />
                            <span className="legend-label">{label}</span>
                            <span className="legend-percent">
                              {(count / total * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;