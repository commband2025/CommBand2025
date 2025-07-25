import React, { useState } from 'react';

// Mock users data - same as in your Login and Signup components
const mockUsers = [
  {
    id: 1,
    name: "Liam Cruz",
    age: 24,
    userType: "PWD - Non-verbal User",
    preferredLanguage: "English",
    email: "liam@example.com",
    password: "password",
    emergencyContact: {
      name: "Ana Cruz",
      relationship: "Mother",
      phone: "+63 912 345 6789"
    },
    medicalInfo: {
      condition: "Autism Spectrum Disorder",
      allergies: "None",
      notes: "Avoid loud noises. May get overwhelmed in crowds."
    },
    phrases: [
      "I am non-verbal. Please scan my band.",
      "I am lost. Can you help me?",
      "Please call my mom.",
      "I need to go to the toilet."
    ],
    photo: "public/liamImage.jpg"
  },
  {
    id: 2,
    name: "Vince Dela Cruz",
    age: 23,
    userType: "Able/Tourist",
    preferredLanguage: "English",
    email: "tourist@example.com",
    password: "password",
    emergencyContact: {
      name: "Efren Dela Cruz",
      relationship: "Father",
      phone: "09059649245"
    },
    medicalInfo: {
      condition: "None",
      allergies: "Shrimp",
      notes: "None"
    },
    phrases: [
      "Hi Good Morning",
      "Can you tell me where is the nearest bus station?",
      "Your welcome",
      "Thank You!"
    ],
    photo:"public/MariaImage.jpg"
  }
];

const ClearStorageButton = () => {
  const [isCleared, setIsCleared] = useState(false);

  const handleClearStorage = () => {
    try {
      // Clear the localStorage data
      localStorage.removeItem('translatorAppUsers');
      localStorage.removeItem('currentUser');
      
      // Reinitialize with mock data
      localStorage.setItem('translatorAppUsers', JSON.stringify(mockUsers));
      
      console.log('localStorage cleared and reinitialized with mock data');
      setIsCleared(true);
      
      // Reset the state after 2 seconds
      setTimeout(() => {
        setIsCleared(false);
      }, 2000);
    } catch (error) {
      console.error('Error clearing/reinitializing storage:', error);
      alert('Error clearing storage. Please try again.');
    }
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
        {isCleared ? 'Cleared & Reset!' : 'Clear Storage'}
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