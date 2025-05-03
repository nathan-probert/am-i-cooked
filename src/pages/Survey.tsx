import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Survey.css';
import { FaHome } from "react-icons/fa";

interface SurveyAnswers {
  [key: string]: string;
}

const Survey = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleChange = (question: string, value: string) => {
    // Set the selected option for animation and update answers immediately
    setSelectedOption(value);
    setAnswers(prev => ({ ...prev, [question]: value }));

    // Wait for animation to complete before advancing
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setSelectedOption(null);
        setError(null);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 300);
    }
  };

  const handlePrevious = () => {
    setError(null);
    setCurrentQuestionIndex(prev => prev - 1);
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
      console.log('Survey submission response:', data);

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
      options: ['Full-time', 'Part-time', 'Internship', 'Contract']
    },
    {
      id: 'salary',
      question: 'What are your salary expectations?',
      options: ['$0-40k', '$40-80k', '$80-120k', '$120-160k', '$160k-200k', '200k+']
    },
    {
      id: 'location',
      question: 'What is your preferred location of work?',
      options: ['On-site', 'Hybrid', 'Remote', 'Any']
    },
    {
      id: 'debuggingStyle',
      question: 'What’s your debugging style?',
      options: ['Rubber duck', 'Print statements', 'Stack Overflow', 'ChatGPT', 'Give Up']
    },
    {
      id: 'hours',
      question: 'How many hours per week are you looking to work?',
      options: ['Less than 20', '20-30', '31-40', '41-50', '50+']
    },
    {
      id: 'industry',
      question: 'What is your preferred field or industry?',
      options: [
        'Web Development',
        'Backend Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'DevOps Engineering',
        'Cybersecurity',
        'Product Management',
        'Any Field'
      ]
    },
    {
      id: 'relocation',
      question: 'Are you open to relocation?',
      options: ['Yes', 'No', 'Depends on location']
    },
    {
      id: 'startTime',
      question: 'How soon are you looking to start working?',
      options: ['Immediately', '4 months', '1 year', '2-3 years', '3+ years']
    },
    {
      id: 'internships',
      question: 'How many internships or co-op terms (4 months each) have you completed?',
      options: ['0', '1', '2', '3', '4', '5+']
    },
    {
      id: 'keyboardPreference',
      question: 'What kind of keyboard do you use?',
      options: ['Mechanical with RGB', 'Laptop keyboard gang', 'Whatever came with the job', 'What’s a keyboard?']
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
      id: 'rejectionReaction',
      question: 'What do you do after getting a job rejection?',
      options: ['Apply to 10 more', 'Cry a little', 'Make it a LinkedIn post', 'Didn’t want the job anyway']
    },
    {
      id: 'leetcode',
      question: 'How many Leetcode problems have you completed?',
      options: ['0', '1-25', '26-50', '51-100', '101-200', '200+']
    },
    {
      id: 'versionControl',
      question: 'Have you worked on any team projects using version control (e.g., Git)?',
      options: ['Yes, extensively', 'Yes, some experience', 'No, but familiar', 'No experience']
    },
    {
      id: 'education',
      question: 'What is the highest level of education you have completed or in progress?',
      options: [
        'High School or Equivalent',
        'Bachelor’s Degree',
        'Master’s Degree',
        'Doctorate (PhD or similar)'
      ]
    },
    {
      id: 'resumeTruth',
      question: 'Be honest… how “real” is your resume?',
      options: ['100% truthful', 'Mildly exaggerated', 'Built by ChatGPT', 'Submitted the template']
    },
    {
      id: 'gpa',
      question: 'What is your GPA?',
      options: ['< 2.0', '2.0-2.5', '2.6-3.0', '3.1-3.5', '3.6-4.0']
    },
    {
      id: 'applications',
      question: 'How many jobs do you apply to in a week on average?',
      options: ['0-10', '11-25', '26-50', '51-100', '101-200', '200+']
    },
    {
      id: 'tailoredMaterials',
      question: 'Do you tailor your resume and cover letter for each job application?',
      options: ['Always', 'Sometimes', 'Rarely', 'Never']
    },
    {
      id: 'containerization',
      question: 'Are you familiar with containerization (e.g., Docker)?',
      options: ['Yes, expert', 'Yes, intermediate', 'Yes, beginner', 'No']
    },
    {
      id: 'workspaceVibe',
      question: 'What’s your ideal work setup?',
      options: ['Standing desk and diffuser', 'Bed + laptop', 'Two monitors minimum', 'Wherever the Wi-Fi works']
    },
    {
      id: 'cloud',
      question: 'Are you familiar with any cloud platforms (e.g., AWS, Azure, GCP)?',
      options: ['Yes, certified', 'Yes, experienced', 'Yes, beginner', 'No']
    },
    {
      id: 'behavioral',
      question: 'Can you answer behavioral interview questions effectively?',
      options: ['Very confident', 'Somewhat confident', 'Need practice', 'Not confident']
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="survey-page">
      <button
        className="home-button"
        onClick={() => navigate('/')}
        title="Home"
        style={{ background: 'transparent', border: 'none' }}
      >
        <FaHome />
      </button>

      <h1>Am I Cooked?</h1>
      <p>Answer these questions to find out if you're cooked! 🔥</p>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="question-counter">Question {currentQuestionIndex + 1} of {questions.length}</p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="survey-form">
        <div className="question-container">
          <h3>{currentQuestion.question}</h3>
          <div className="options-container">
            {currentQuestion.options.map((option) => (
              <label
                key={option}
                className={`option-label ${answers[currentQuestion.id] === option ? 'selected' : ''} ${selectedOption === option ? 'animate' : ''}`}
                onClick={() => handleChange(currentQuestion.id, option)}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  readOnly
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="navigation-buttons">
          {currentQuestionIndex > 0 && (
            <button
              className="nav-button"
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}

          {isLastQuestion && (
            <button
              className="nav-button submit-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Survey'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Survey;