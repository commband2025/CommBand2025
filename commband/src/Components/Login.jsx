import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Phone, Mail, MapPin, AlertTriangle, QrCode, UserPlus, LogIn, Home, Camera, MessageSquare } from 'lucide-react';
import '../CSS/Login.css'; 

// Mock users data
const loginIcon = "/COMMBAND_Icon.jpg";
const MariaImage = "/MariaImage.jpg";
const liamImage = "/liamImage.jpg";
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
    name: "Maria Santos",
    age: 28,
    userType: "Deaf User",
    preferredLanguage: "Filipino Sign Language",
    email: "maria@example.com",
    password: "password",
    emergencyContact: {
      name: "Juan Santos",
      relationship: "Father",
      phone: "+63 917 123 4567"
    },
    medicalInfo: {
      condition: "Profound Hearing Loss",
      allergies: "Penicillin",
      notes: "Communicates primarily through sign language. Has cochlear implant."
    },
    phrases: [
      "I am deaf. Please be patient.",
      "Can you write it down?",
      "I need help finding the hospital.",
      "Please call my emergency contact."
    ],
    photo:"public/MariaImage.jpg"
  }
];

// Login Component
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is already logged in and initialize localStorage
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Initialize localStorage with mock users if not already present
        const storedUsers = localStorage.getItem('translatorAppUsers');
        if (!storedUsers) {
          localStorage.setItem('translatorAppUsers', JSON.stringify(mockUsers));
        }

        // Check if user is already logged in
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const user = JSON.parse(currentUser);
          // Verify the user still exists in the users list
          const users = JSON.parse(localStorage.getItem('translatorAppUsers') || '[]');
          const userExists = users.find(u => u.id === user.id);
          
          if (userExists) {
            // User is logged in and valid, redirect to profile
            navigate(`/profile/${user.id}`);
            return;
          } else {
            // User doesn't exist anymore, clear the session
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear potentially corrupted session data
        localStorage.removeItem('currentUser');
      } finally {
        setIsChecking(false);
      }
    };

    // Only check auth status if we're on the login page
    if (location.pathname === '/login') {
      checkAuthStatus();
    } else {
      setIsChecking(false);
    }
  }, [location.pathname, navigate]);

  const handleLogin = () => {
    try {
      // Get users from localStorage
      const storedUsers = localStorage.getItem('translatorAppUsers');
      if (!storedUsers) {
        setError('No users found. Please try again.');
        return;
      }

      const users = JSON.parse(storedUsers);
      
      // Find user with matching email and password
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate(`/profile/${user.id}`);
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Clear error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src={loginIcon} alt="Login Icon" className="login-icon"/>
            <h1 className="login-title">Translator App</h1>
            <p className="login-subtitle">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={loginIcon} alt="Login Icon" className="login-icon"/>
          
          <p className="login-subtitle">Login </p>
        </div>

        <div className="login-form">
          <div className="login-form-group">
            <label className="login-label">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email"
              className="login-input"
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              className="login-input"
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="login-button"
          >
            <LogIn className="login-button-icon" size={20} />
            Login
          </button>
        </div>

        <div className="login-signup-section">
          <p className="login-signup-text">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="login-signup-link"
            >
              Sign up here
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;