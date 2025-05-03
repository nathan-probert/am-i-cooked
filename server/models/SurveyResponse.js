const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema({
  jobType: String,
  salary: String,
  location: String,
  companySize: String,
  hours: String,
  industry: String,
  relocation: String,
  startTime: String,
  internships: String,
  projects: String,
  github: String,
  hackathons: String,
  leetcode: String,
  versionControl: String,
  education: String,
  gpa: String,
  applications: String,
  tailoredResume: String,
  containerization: String,
  cloud: String,
  deployment: String,
  behavioral: String,
  cookedPercentage: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);