# [_Am I Cooked?_](https://am-i-cooked-zeta.vercel.app/)

[_Am I Cooked?_](https://am-i-cooked-zeta.vercel.app/) is a fun, AI-powered web application that helps users assess their job readiness for computer science and tech roles. By combining a detailed survey and optional resume upload, the app provides an insightful "Cooked-O-Meter" score, personalized feedback, and actionable recommendations.

[_Am I Cooked?_](https://am-i-cooked-zeta.vercel.app/) was built in under 30 hours by a team of three driven developers during the 2025 GDSC Hacks Hackathon.

## Features

- 🤔 **Interactive Survey**: Answer questions about your job search, experience, skills, and preferences.
- 📄 **Resume Upload**: Optionally upload your resume (PDF) for quick analysis of your skills and experience.
- 🤖 **AI-Powered Analysis**: Uses Google Gemini to evaluate your responses and resume, returning a "cooked percentage" and tailored advice.
- 🥩 **Cooked-O-Meter Visualization**: Fun, visual feedback on your job readiness, from "Raw" to "Burnt".
- 🫵 **Personalized Feedback**: Strengths, areas for improvement, and recommendations.
- 📊 **Statistics Dashboard**: See aggregate stats and trends from all users.
- 📲 **Responsive UI**: UI that resizes and restructures itself dynamically to optimize for your device.
- 🐰🥚 **Easter Egg**: Can you find it???

## Tech Stack

- ⚛️ **Frontend**: React + TypeScript, Vite
- 🍃 **Backend**: Node.js, Express, MongoDB, Google Gemini API
- 🚀 **Deployment**: Render, Vercel

## Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas instance
- Google Gemini API key

### 1. Clone the repository
```sh
git clone <repo-url>
cd am-i-cooked
```

### 2. Setup the Backend
```sh
cd server
cp .env.example .env # Create your .env file
# Fill in MONGODB_URI and GEMINI_API_KEY in .env
npm install
npm run dev # or npm start
```

### 3. Setup the Frontend
```sh
cd ..
npm install
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:3000](http://localhost:3000) by default.

## Usage
1. Open the app in your browser.
2. Take the survey and/or upload your resume.
3. Submit to get your Cooked-O-Meter results and feedback.
4. View stats or try to find the Easter egg!

## API Endpoints (Backend)
- `POST /api/survey` — Submit survey (and optional resume) for analysis
- `POST /api/parse-pdf` — Parse PDF resume to extract text
- `POST /api/analyze-resume` — Analyze resume text only
- `GET /api/survey/stats` — Get aggregate survey statistics

## Environment Variables (Backend)
- `MONGODB_URI` — MongoDB connection string
- `GEMINI_API_KEY` — Google Gemini API key

## The Three Driven Devs
- [Adam Montgomery](https://www.linkedin.com/in/adam-montgomery-05a936315/)
- [Benjamin Probert](https://www.linkedin.com/in/benjamin-probert/)
- [Nathan Probert](https://www.linkedin.com/in/nathanprobert/)

## License
MIT

---

*Made for fun and career self-reflection. Not actual career advice!*
