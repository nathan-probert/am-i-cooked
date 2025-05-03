const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const allQuestions = [
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

async function analyzeSurveyResponses(responses) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `
    You are a sharp, no-nonsense career advisor. Analyze the following job search survey responses to assess whether the candidate is "cooked" (underprepared) or not.
    
    **Definitions:**
    - "Cooked" means clearly underprepared, lacking direction, or not competitive for their desired job.
    - Treat openness (e.g. selecting "Any" for location or "Any Field") as a strength unless paired with other vague/low-effort answers.
    - Salary expectations should match experience level.
    - Use evidence of experience (internships, projects, GitHub, teamwork, etc.) and strategy (tailored applications, Leetcode, hackathons) to guide your assessment.
    - Use the **Answer Options** below to understand the range of possible responses for each question.
    
    ---
    
    **Survey Questions and Answer Options:**
    
    ${allQuestions.map(q => `- ${q.question}\n  Options: ${q.options.join(', ')}`).join('\n')}
    
    ---
    
    Now, analyze the candidate based on their survey answers below. Speak directly to them, and give honest, constructive feedback.
    
    Survey Responses:
    ${Object.entries(responses)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')}
    
    Return your response as valid JSON in the following structure:
    
    {
      "isCooked": boolean,
      "overallAssessment": "string",
      "strengths": ["string", "string", "string"],
      "areasForImprovement": ["string", "string", "string"],
      "recommendations": ["string", "string", "string"],
      "confidenceScore": number
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Attempt to extract JSON from the response text
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing Gemini response:', text);
      throw new Error('Failed to parse analysis results');
    }
  } catch (error) {
    console.error('Error analyzing survey responses:', error);
    throw error;
  }
}

async function analyzeResumeText(resumeText) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' }); // Using a potentially more capable model

    const prompt = `
    As a career advisor, analyze the following resume text and provide a detailed assessment of whether the candidate is "cooked" (unprepared) or not for their job search based *solely* on this resume. The user is pursuing a computer science related role. Address the candidate directly in your response.

    Resume Text:
    --- START RESUME ---
    ${resumeText}
    --- END RESUME ---

    Please provide:
    1. An overall assessment (are they cooked based on the resume?). Make this very brief (ie. 2 sentences).
    2. Key strengths evident from the resume (3 bullet points)
    3. Areas for improvement in the resume (3 bullet points)
    4. Specific recommendations for enhancing the resume (3 bullet points)
    5. A confidence score (0-100%) representing how well-prepared the candidate *appears* based *only* on this resume.

    Format the response strictly as JSON with the following structure:
    {
      "isCooked": boolean,
      "overallAssessment": "string",
      "strengths": ["string"],
      "areasForImprovement": ["string"],
      "recommendations": ["string"],
      "confidenceScore": number
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Attempt to extract JSON from the response text
    const jsonMatch = text.match(/\{.*\}/s); // More robust regex to find JSON block
    if (!jsonMatch) {
      console.error('No JSON found in Gemini response:', text);
      throw new Error('Failed to find analysis results in the expected format.');
    }
    const jsonString = jsonMatch[0];

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing Gemini response JSON:', jsonString);
      console.error('Original text:', text); // Log original text for debugging
      throw new Error('Failed to parse analysis results');
    }
  } catch (error) {
    console.error('Error analyzing resume text:', error);
    throw error; // Re-throw the error to be caught by the route handler
  }
}

module.exports = {
  analyzeSurveyResponses,
  analyzeResumeText // Add the new function here
};