import React, { useState } from 'react';

const ClearStorageButton = () => {
  const [isCleared, setIsCleared] = useState(false);

  const handleClearStorage = () => {
    // In a real environment, this would be:
     localStorage.removeItem('translatorAppUsers');
    
    // For demonstration in this environment:
    console.log('localStorage.removeItem("translatorAppUsers") would be called');
    setIsCleared(true);
    
    // Reset the state after 2 seconds
    setTimeout(() => {
      setIsCleared(false);
    }, 2000);
  };

  return (
    <div style={containerStyle}>
      <button 
        style={isCleared ? buttonStyleSuccess : buttonStyle}
        onClick={handleClearStorage}
        onMouseEnter={(e) => {
          if (!isCleared) {
            e.target.style.backgroundColor = '#45a049';
            e.target.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isCleared) {
            e.target.style.backgroundColor = '#4CAF50';
            e.target.style.transform = 'translateY(0)';
          }
        }}
      >
        {isCleared ? 'Cleared!' : 'Clear Storage'}
      </button>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
 
  alignItems: 'center',
  minHeight: '50px',
  padding: '10px',
  backgroundColor: '#f8fff8'
};

const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '10px 10px',
  fontSize: '10px',
  fontWeight: '500',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  outline: 'none'
};

const buttonStyleSuccess = {
  ...buttonStyle,
  backgroundColor: '#45a049',
  transform: 'scale(0.95)'
};

export default ClearStorageButton;