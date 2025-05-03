require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SurveyResponse = require('./models/SurveyResponse');
// Import the specific functions needed
const { analyzeFullSurvey, analyzeSurveyAndResume, analyzeResumeText } = require('./services/geminiService');

const app = express();

// Middleware
// Allow all origins
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

// Routes
app.post('/api/survey', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' }); // Use 503 Service Unavailable
    }

    const { resumeText, ...surveyAnswers } = req.body;
    let analysis;

    // Determine which analysis function to call
    if (resumeText && typeof resumeText === 'string' && resumeText.trim() !== '') {
      console.log('Analyzing survey with resume text...');
      // Call the function for combined analysis
      analysis = await analyzeSurveyAndResume({ ...surveyAnswers, resumeText });
    } else {
      console.log('Analyzing full survey without resume text...');
      // Call the function for full survey analysis
      analysis = await analyzeFullSurvey(surveyAnswers); // Pass only survey answers
    }

    const surveyData = {
      ...req.body, // Save the original request body (including resumeText if present)
      cookedPercentage: analysis.cookedPercentage, // Save the calculated cooked percentage
      analysisDetails: analysis // Optionally save the full analysis object
    };

    const surveyResponse = new SurveyResponse(surveyData);
    await surveyResponse.save();

    res.status(201).json({
      message: 'Survey response saved successfully',
      analysis // Return the analysis object from Gemini
    });
  } catch (error) {
    console.error('Error processing survey:', error);
    // Check if the error is from Gemini parsing or analysis
    if (error.message.includes('Failed to parse analysis results') || error.message.includes('Error analyzing')) {
      res.status(500).json({
        error: 'Failed to analyze survey data. Could not get results from analysis service.',
        details: error.message
      });
    } else if (error.message.includes('Database not connected')) {
      res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }
    else {
      res.status(500).json({
        error: 'Failed to process survey due to an internal server error.',
        details: error.message // Avoid exposing too many details in production
      });
    }
  }
});

app.get('/api/survey/stats', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    // Select only necessary fields to reduce payload size, exclude analysisDetails by default
    const surveys = await SurveyResponse.find({}).select('-analysisDetails');
    res.json(surveys);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    if (error.message.includes('Database not connected')) {
      res.status(503).json({ error: 'Database not connected. Please try again later.' });
    } else {
      res.status(500).json({
        error: 'Failed to fetch statistics',
        details: error.message
      });
    }
  }
});

const pdfParse = require('pdf-parse');

app.post('/api/parse-pdf', async (req, res) => {
  try {
    const { file } = req.body; // expecting base64-encoded file

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const buffer = Buffer.from(file, 'base64');
    const data = await pdfParse(buffer);

    res.status(200).json({ text: data.text });
  } catch (err) {
    console.error('Error parsing PDF:', err);
    res.status(500).json({ error: 'Failed to parse PDF', details: err.message });
  }
});

// New route for analyzing resume text
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'No resume text provided' });
    }

    // Analyze resume text using the new Gemini service function
    const analysis = await analyzeResumeText(resumeText); // Use the new function

    res.status(200).json({
      message: 'Resume analyzed successfully',
      analysis
    });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      error: 'Failed to analyze resume',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
