require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SurveyResponse = require('./models/SurveyResponse');
const { analyzeSurveyResponses, analyzeResumeText } = require('./services/geminiService');

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
      throw new Error('Database not connected');
    }

    // Analyze responses using Gemini
    const analysis = await analyzeSurveyResponses(req.body);
    analysis.confidenceScore = 100 - analysis.confidenceScore;

    const surveyData = {
      ...req.body,
      cookedPercentage: analysis.confidenceScore,
    };

    const surveyResponse = new SurveyResponse(surveyData);
    await surveyResponse.save();

    res.status(201).json({
      message: 'Survey response saved successfully',
      analysis
    });
  } catch (error) {
    console.error('Error processing survey:', error);
    res.status(500).json({
      error: 'Failed to process survey',
      details: error.message
    });
  }
});

app.get('/api/survey/stats', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    const surveys = await SurveyResponse.find({}); // Fetch all documents
    res.json(surveys);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      details: error.message
    });
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
    // The confidence score from the resume analysis might represent preparedness, adjust if needed.
    // Let's assume higher score = better prepared (less 'cooked')
    analysis.confidenceScore = 100 - analysis.confidenceScore; // Uncomment if score represents 'cookedness'

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
