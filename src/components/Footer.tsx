import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="credit-footer">
      <div><strong>Please Note:</strong> Processing data may take multiple minutes due to high demand.</div>
      Made by{' '}
      <a href="https://www.linkedin.com/in/adam-montgomery-05a936315/" target="_blank" rel="noopener noreferrer">
        Adam Montgomery
      </a>
      ,{' '}
      <a href="https://www.linkedin.com/in/benjamin-probert/" target="_blank" rel="noopener noreferrer">
        Benjamin Probert
      </a>
      , &{' '}
      <a href="https://www.linkedin.com/in/nathanprobert/" target="_blank" rel="noopener noreferrer">
        Nathan Probert
      </a>
      .
    </div>
  );
};

export default Footer;