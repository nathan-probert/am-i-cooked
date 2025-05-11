import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './Stats.css';

interface SurveyData {
  _id: string; // Assuming the API transforms the MongoDB ObjectId to a string
  jobType: string;
  salary: string;
  location: string;
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
  containerization: string;
  cloud: string;
  behavioral: string;
  timestamp: string; // Assuming the API transforms the MongoDB Date to a string or number
  cookedPercentage: number; // Assuming the API extracts the number from the object
  __v?: number; // Assuming the API extracts the number from the object
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
  const [surveys, setSurveys] = useState<SurveyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fieldCategories = [
    {
      title: 'Job Details',
      icon: '💼',
      fields: ['jobType', 'salary', 'industry', 'location']
    },
    {
      title: 'Education & Skills',
      icon: '🎓',
      fields: ['education', 'gpa', 'versionControl', 'containerization', 'cloud']
    },
    {
      title: 'Experience & Activities',
      icon: '⚙️',
      fields: ['internships', 'projects', 'github', 'hackathons', 'leetcode']
    },
    {
      title: 'Job Search Strategy',
      icon: '🔍',
      fields: ['applications', 'behavioral', 'relocation']
    },
    {
      title: 'Work Preferences',
      icon: '⏰',
      fields: ['hours', 'startTime']
    }
  ];

  const getFieldDistribution = (field: keyof SurveyData): FrequencyData => {
    return surveys.reduce((acc, survey) => {
      const value = survey[field];
      // Check if the value is not null, undefined, or an empty string
      if (value !== null && value !== undefined && value !== '') {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    }, {} as FrequencyData);
  };

  // Get distribution of cooked percentages by range
  const getCookedDistribution = (): FrequencyData => {
    const ranges = {
      'Not Cooked (0-25%)': 0,
      'Lightly Cooked (26-50%)': 0,
      'Medium Cooked (51-75%)': 0,
      'Well Cooked (76-100%)': 0
    };

    surveys.forEach(survey => {
      const percent = survey.cookedPercentage;
      // Ensure cookedPercentage is a valid number before categorizing
      if (typeof percent === 'number' && !isNaN(percent)) {
        if (percent <= 25) {
          ranges['Not Cooked (0-25%)']++;
        } else if (percent <= 50) {
          ranges['Lightly Cooked (26-50%)']++;
        } else if (percent <= 75) {
          ranges['Medium Cooked (51-75%)']++;
        } else {
          ranges['Well Cooked (76-100%)']++;
        }
      }
    });

    return ranges;
  };

  // Calculate statistics from survey data
  const calculateStats = () => {
    if (!surveys.length) return { avgCooked: 0, minCooked: 0, maxCooked: 0 };

    const cookedValues = surveys
      .map(s => s.cookedPercentage)
      .filter(val => typeof val === 'number' && !isNaN(val)); // Ensure only valid numbers are considered

    if (!cookedValues.length) return { avgCooked: 0, minCooked: 0, maxCooked: 0 };

    const sum = cookedValues.reduce((acc, val) => acc + val, 0);
    const avg = sum / cookedValues.length;
    const min = Math.min(...cookedValues);
    const max = Math.max(...cookedValues);

    return {
      avgCooked: avg,
      minCooked: min,
      maxCooked: max
    };
  };

  useEffect(() => {
    const fetchSurveys = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://am-i-cooked-vssc.onrender.com/api/survey/stats');
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

  const stats = calculateStats();

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

  // Handle case where there are no surveys after loading
  if (!isLoading && surveys.length === 0 && !error) return (
    <div className="stats-page">
      <div className="content">
        <header className="stats-header">
          <h1>📊 Survey Statistics</h1>
        </header>
        <div className="no-data-message">
          <p>No survey data available yet.</p>
        </div>
      </div>
    </div>
  );


  return (
    <div className="stats-page">
      <button
        className="home-button"
        onClick={() => navigate('/')}
        title="Home"
      >
        <FaHome />
      </button>
      <div className="content">
        <header className="stats-header">
          <h1>📊 Survey Statistics</h1>
        </header>

        <div className="key-metrics">
          <div className="metrics-grid">
            {/* Total Responses Card */}
            <div className="metric-card">
              <div className="metric-icon-container">
                <span className="metric-icon">📋</span>
              </div>
              <div className="metric-content">
                <div className="metric-text">
                  <p className="metric-label">Total Survey Responses</p>
                  <p className="metric-value">{surveys.length}</p>
                </div>
              </div>
            </div>

            {/* Average Cooked Percentage Card */}
            <div className="metric-card">
              <div className="metric-icon-container">
                <span className="metric-icon">🔥</span>
              </div>
              <div className="metric-content">
                <div className="metric-text">
                  <p className="metric-label">Average Cooked Percentage</p>
                  <p className="metric-value">{stats.avgCooked.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cooked-distribution-section">
          <h2>Cooked Percentage Distribution</h2>
          <div className="chart-container cooked-distribution">
            {(() => {
              const cookedDistribution = getCookedDistribution();
              const total = Object.values(cookedDistribution).reduce((sum, count) => sum + count, 0);

              if (total === 0) {
                return <p className="no-data-chart">No data for cooked distribution.</p>;
              }

              let startAngle = 0;

              return (
                <>
                  <svg viewBox="0 0 100 100" className="pie-chart">
                    {Object.entries(cookedDistribution).map(([label, count], index) => {
                      if (count === 0) return null;
                      const percentage = count / total;
                      const endAngle = startAngle + percentage * 2 * Math.PI;

                      const x1 = 50 + 40 * Math.cos(startAngle);
                      const y1 = 50 + 40 * Math.sin(startAngle);
                      const x2 = 50 + 40 * Math.cos(endAngle);
                      const y2 = 50 + 40 * Math.sin(endAngle);

                      const largeArc = percentage > 0.5 ? 1 : 0;

                      const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

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
                    {Object.entries(cookedDistribution).map(([label, count], index) => (
                      <div key={label} className="legend-item">
                        <span
                          className="legend-color"
                          style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                        />
                        <span className="legend-label">{label}</span>
                        <span className="legend-value">{count} people</span>
                        <span className="legend-percent">
                          {(count / total * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
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

                  return (
                    <div key={field} className="field-card">
                      <div className="field-header">
                        <h3>{formatLabel(field)}</h3>
                        <span className="response-count">{total} responses</span>
                      </div>
                      <div className="chart-container">
                        {total === 0 ? (
                          <p className="no-data-chart">No data for this field.</p>
                        ) : (
                          (() => {
                            let startAngle = 0;
                            return (
                              <>
                                <svg viewBox="0 0 100 100" className="pie-chart">
                                  {Object.entries(data).map(([label, count], index) => {
                                    // No need to check count === 0 here as getFieldDistribution filters them
                                    const percentage = count / total;
                                    const endAngle = startAngle + percentage * 2 * Math.PI;

                                    const x1 = 50 + 40 * Math.cos(startAngle);
                                    const y1 = 50 + 40 * Math.sin(startAngle);
                                    const x2 = 50 + 40 * Math.cos(endAngle);
                                    const y2 = 50 + 40 * Math.sin(endAngle);

                                    const largeArc = percentage > 0.5 ? 1 : 0;

                                    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

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
                                      ></span>
                                      <span className="legend-label">{label}</span>
                                      <span className="legend-percent">
                                        {(count / total * 100).toFixed(1)}%
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </>
                            );
                          })()
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;