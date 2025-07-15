import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, AlertTriangle, QrCode, UserPlus, LogIn, Home, Camera, MessageSquare } from 'lucide-react';
import '/src/CSS/CommBand.css';
import Login from '/src/Components/Login';
import Signup from '/src/Components/SignUp';
import ProfileDisplay from '/src/Components/Profiledisplay';

// Router Component
const Router = ({ children }) => {
  const [currentPath, setCurrentPath] = useState('/login');
  
  const navigate = (path) => {
    console.log('Navigating to:', path);
    setCurrentPath(path);
  };

  // Function to parse dynamic routes
  const parseRoute = (path) => {
    // Handle profile routes like /profile/1, /profile/2, etc.
    const profileMatch = path.match(/^\/profile\/(\d+)$/);
    if (profileMatch) {
      return {
        route: '/profile',
        userId: parseInt(profileMatch[1])
      };
    }
    
    // Handle other static routes
    return {
      route: path,
      userId: null
    };
  };

  const { route, userId } = parseRoute(currentPath);

  return (
    <div className="min-h-screen bg-gray-50">
      {React.Children.map(children, child =>
        React.cloneElement(child, { 
          currentPath, 
          navigate, 
          route, 
          userId 
        })
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <Login />
      <Signup />
      <ProfileDisplay />
    </Router>
  );
};

export default App;