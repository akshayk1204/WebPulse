import React from 'react';
import './PulsingLoader.css';

const PulsingLoader = () => {
  return (
    <div className="pulsing-loader-container">
      <div className="pulse-circle" />
      <p className="pulse-text">Analyzing website... Please wait</p>
    </div>
  );
};

export default PulsingLoader;
