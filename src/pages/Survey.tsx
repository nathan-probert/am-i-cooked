import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Survey.css';

interface SurveyAnswers {
  [key: string]: string;
}

const Survey = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (question: string, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    
    if (answeredQuestions < totalQuestions) {
      setError(`Please answer all questions (${answeredQuestions}/${totalQuestions} answered)`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      const data = await response.json();
      
      // Navigate to results with the analysis data
      navigate('/results', { state: { analysis: data.analysis } });
    } catch (err) {
      setError('Failed to submit survey. Please try again.');
      console.error('Survey submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions = [
    {
      id: 'jobType',
      question: 'What type of job are you looking for?',
      options: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote']
    },
    {
      id: 'salary',
      question: 'What are your salary expectations?',
      options: ['$0-40k', '$40-60k', '$60-80k', '$80-100k', '$100k+']
    },
    {
      id: 'location',
      question: 'What is your preferred location of work?',
      options: ['On-site', 'Hybrid', 'Remote', 'Flexible']
    },
    {
      id: 'companySize',
      question: 'What size of company do you prefer?',
      options: ['Startup (<50)', 'Small (50-200)', 'Medium (201-1000)', 'Large (1000+)']
    },
    {
      id: 'hours',
      question: 'How many hours per week are you looking to work?',
      options: ['Less than 20', '20-30', '31-40', '41-50', '50+']
    },
    {
      id: 'industry',
      question: 'What is your preferred field or industry?',
      options: ['Software Development', 'Data Science', 'DevOps', 'Cloud Computing', 'Cybersecurity', 'Other']
    },
    {
      id: 'relocation',
      question: 'Are you open to relocation?',
      options: ['Yes', 'No', 'Depends on location']
    },
    {
      id: 'startTime',
      question: 'How soon are you looking to start working?',
      options: ['Immediately', '2 weeks', '1 month', '2-3 months', '3+ months']
    },
    {
      id: 'internships',
      question: 'How many internships or co-op terms have you completed?',
      options: ['0', '1', '2', '3', '4+']
    },
    {
      id: 'projects',
      question: 'Have you contributed to any personal or open source projects?',
      options: ['Yes, multiple', 'Yes, one or two', 'No, but planning to', 'No']
    },
    {
      id: 'github',
      question: 'Do you have a GitHub profile?',
      options: ['Yes, active', 'Yes, but inactive', 'No']
    },
    {
      id: 'hackathons',
      question: 'Have you participated in any hackathons or competitions?',
      options: ['Yes, multiple', 'Yes, one or two', 'No, but planning to', 'No']
    },
    {
      id: 'leetcode',
      question: 'How many Leetcode problems have you completed?',
      options: ['0', '1-50', '51-200', '201-500', '500+']
    },
    {
      id: 'versionControl',
      question: 'Have you worked on any team projects using version control (e.g., Git)?',
      options: ['Yes, extensively', 'Yes, some experience', 'No, but familiar', 'No experience']
    },
    {
      id: 'education',
      question: 'What is the highest level of education you have completed?',
      options: ['High School', 'Some College', 'Bachelors', 'Masters', 'PhD']
    },
    {
      id: 'gpa',
      question: 'What is your GPA?',
      options: ['< 2.0', '2.0-2.5', '2.6-3.0', '3.1-3.5', '3.6-4.0']
    },
    {
      id: 'applications',
      question: 'How many jobs do you apply to in a week on average?',
      options: ['0-5', '6-10', '11-20', '21-30', '30+']
    },
    {
      id: 'tailoredResume',
      question: 'Do you tailor your resume to each job you apply for?',
      options: ['Always', 'Sometimes', 'Rarely', 'Never']
    },
    {
      id: 'containerization',
      question: 'Are you familiar with containerization (e.g., Docker)?',
      options: ['Yes, expert', 'Yes, intermediate', 'Yes, beginner', 'No']
    },
    {
      id: 'cloud',
      question: 'Are you familiar with any cloud platforms (e.g., AWS, Azure, GCP)?',
      options: ['Yes, certified', 'Yes, experienced', 'Yes, beginner', 'No']
    },
    {
      id: 'deployment',
      question: 'Are you familiar with deployment processes?',
      options: ['Yes, expert', 'Yes, intermediate', 'Yes, beginner', 'No']
    },
    {
      id: 'behavioral',
      question: 'Can you answer behavioral interview questions effectively?',
      options: ['Very confident', 'Somewhat confident', 'Need practice', 'Not confident']
    }
  ];

  return (
    <div className="survey-page">
      <h1>Career Readiness Survey</h1>
      <p>Answer these questions to find out if you're cooked! 🔥</p>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form className="survey-form" onSubmit={(e) => e.preventDefault()}>
        {questions.map((q) => (
          <div key={q.id} className="question-container">
            <h3>{q.question}</h3>
            <div className="options-container">
              {q.options.map((option) => (
                <label key={option} className="option-label">
                  <input
                    type="radio"
                    name={q.id}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <button 
          className="redirect-button submit-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Survey'}
        </button>
      </form>
    </div>
  );
};

export default Survey; 