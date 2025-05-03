import React from 'react';

const EasterEgg = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
      padding: '2rem'
    }}>
      <h1 style={{
        color: 'white',
        fontSize: '2.5rem',
        marginBottom: '2rem',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
      }}>
        Meet your Google Gemini AI Travel Companion (GGATC)!
      </h1>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '1rem',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '90%',
        maxHeight: '80vh'
      }}>
        <img 
          src="/ChatGPT Image May 3, 2025, 05_16_15 PM.png" 
          alt="Easter Egg"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '10px'
          }}
        />
      </div>
    </div>
  );
};

export default EasterEgg;