require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const SurveyResponse = require('./models/SurveyResponse');
const { analyzeSurveyResponses } = require('./services/geminiService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});