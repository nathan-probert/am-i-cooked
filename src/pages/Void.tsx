import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Void = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent using the back button to escape
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#000', 
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }} />
  );
};

export default Void;