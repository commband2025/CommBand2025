import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, AlertTriangle, QrCode, UserPlus, LogIn, Home, Camera, MessageSquare } from 'lucide-react';
import '/src/CSS/ProfileDisplay.css';
import ProfileCard from '/src/Components/ProfileCard';

// Profile Display Component
const loginIcon = "/COMMBAND_Icon.jpg";
const ProfileDisplay = ({ currentPath, navigate, route, userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only run if we're on the profile route
    if (route === '/profile' && userId) {
      console.log('Loading profile for user ID:', userId);
      loadUserProfile(userId);
    } else if (currentPath?.startsWith('/profile/')) {
      // Fallback to extract userId from currentPath if route/userId not provided
      const pathUserId = currentPath.split('/')[2];
      if (pathUserId) {
        console.log('Loading profile for user ID from path:', pathUserId);
        loadUserProfile(parseInt(pathUserId));
      }
    }
  }, [route, userId, currentPath]);

  const loadUserProfile = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Get users from localStorage
      const storedUsers = localStorage.getItem('translatorAppUsers');
      if (!storedUsers) {
        throw new Error('No users found in storage');
      }

      const users = JSON.parse(storedUsers);
      console.log('All users from localStorage:', users);
      
      // Find user by ID
      const foundUser = users.find(u => u.id === id);
      console.log('Found user:', foundUser);
      
      if (!foundUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      setUser(foundUser);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      // Clear the current user session (logged in status)
      localStorage.removeItem('currentUser');
      
      // Clear the users data from localStorage
     // localStorage.removeItem('translatorAppUsers');
      
      // Optional: Clear any other related data
      // localStorage.clear(); // Use this if you want to clear all localStorage data
      
      console.log('User logged out successfully');
      
      // Navigate back to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, still try to navigate to login
      navigate('/login');
    }
  };

  // Only render if we're on the profile route
  if (route !== '/profile' && !currentPath?.startsWith('/profile/')) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No user data available</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          
          <div className='HeaderDiv'>
            <img src={loginIcon} alt="Login Icon" className="login-icon"/>
            <h1 className="UserProfileHeader">User Profile</h1>
          </div>
        
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          
        </div>
                
        <div className="grid lg:grid-cols-2 gap-8">
          <ProfileCard user={user} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;