import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Resume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert('Please select a resume PDF first.');
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];

      try {
        const response = await fetch('https://am-i-cooked-vssc.onrender.com/api/parse-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64 }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to parse PDF');
        }

        // Navigate to Survey page with resume text instead of analyzing here
        navigate('/survey', { state: { resumeText: data.text } });

      } catch (error) {
        console.error('Error sending PDF:', error);
        // Keep the alert specific to parsing failure
        alert('Failed to parse PDF');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="resume-page">
      <h1>Resume Upload</h1>
      <p>Upload your resume to find out if you're cooked!</p>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button className="redirect-button" onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
    </div>
  );
};

export default Resume;
