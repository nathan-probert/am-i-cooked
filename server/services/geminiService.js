const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeSurveyResponses(responses) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const prompt = `
    As a career advisor, analyze these job search survey responses and provide a detailed assessment of whether the candidate is "cooked" (unprepared) or not for their job search. Consider their preparation level, experience, and job search strategy. Address the candidate directly in your response.

    Survey Responses:
    ${Object.entries(responses)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}

    Please provide:
    1. An overall assessment (are they cooked?). Make this very brief (ie. 2 sentences).
    2. Key strengths (3 bullet points)
    3. Areas for improvement (3 bullet points)
    4. Specific recommendations (3 bullet points)
    5. A confidence score (0-100%)

    Format the response as JSON with the following structure:
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

module.exports = {
  analyzeSurveyResponses
}; 