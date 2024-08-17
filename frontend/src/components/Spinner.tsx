// Spinner.tsx
import React from 'react';

const spinnerStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  position: 'relative',
  margin: '100px auto',
};

const bounceStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  backgroundColor: '#333',
  opacity: 0.6,
  position: 'absolute',
  top: 0,
  left: 0,
  animation: 'sk-bounce 2.0s infinite ease-in-out',
};

const bounce2Style: React.CSSProperties = {
  ...bounceStyle,
  animationDelay: '-1.0s',
};

// Keyframes are added directly in the style element
const keyframesStyle = `
  @-webkit-keyframes sk-bounce {
    0%, 100% { -webkit-transform: scale(0.0); }
    50% { -webkit-transform: scale(1.0); }
  }
  
  @keyframes sk-bounce {
    0%, 100% { 
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    } 
    50% { 
      transform: scale(1.0);
      -webkit-transform: scale(1.0);
    }
  }
`;

export const Spinner: React.FC = () => {
  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={spinnerStyle}>
        <div style={bounceStyle}></div>
        <div style={bounce2Style}></div>
      </div>
    </>
  );
};

export default Spinner;
