import React from 'react';

const SplashScreen = () => {
  return (
    <div 
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        color: '#ffffff'
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        YouTube Sequencer
      </h1>
      <div 
        style={{
          width: '50px',
          height: '50px',
          border: '3px solid #ffffff',
          borderTop: '3px solid #646464',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SplashScreen;
