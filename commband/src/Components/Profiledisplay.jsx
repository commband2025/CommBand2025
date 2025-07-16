import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { User, Phone, Mail, MapPin, AlertTriangle, QrCode, UserPlus, LogIn, Home, Camera, MessageSquare, Lock, Eye, EyeOff, X } from 'lucide-react';
import '../CSS/ProfileDisplay.css';
import ProfileCard from './ProfileCard';

// Profile Display Component
const loginIcon = "/COMMBAND_Icon.jpg";
const ProfileDisplay = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Change password modal states
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    // Check if we have a userId parameter
    if (userId) {
      console.log('Loading profile for user ID:', userId);
      loadUserProfile(parseInt(userId));
    } else if (location.pathname.startsWith('/profile/')) {
      // Fallback to extract userId from pathname
      const pathUserId = location.pathname.split('/')[2];
      if (pathUserId) {
        console.log('Loading profile for user ID from path:', pathUserId);
        loadUserProfile(parseInt(pathUserId));
      }
    } else {
      // No userId provided, redirect to login
      navigate('/login');
    }
  }, [userId, location.pathname, navigate]);

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

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
    if (passwordSuccess) {
      setPasswordSuccess('');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswordChange = () => {
    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required');
      return false;
    }
    
    if (!passwordForm.newPassword) {
      setPasswordError('New password is required');
      return false;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return false;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return false;
    }
    
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from current password');
      return false;
    }
    
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordChange()) {
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');

    try {
      // Get users from localStorage
      const storedUsers = localStorage.getItem('translatorAppUsers');
      if (!storedUsers) {
        throw new Error('No users found in storage');
      }

      const users = JSON.parse(storedUsers);
      
      // Find the current user
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const currentUser = users[userIndex];
      
      // Verify current password
      if (currentUser.password !== passwordForm.currentPassword) {
        setPasswordError('Current password is incorrect');
        return;
      }

      // Update password
      users[userIndex] = {
        ...currentUser,
        password: passwordForm.newPassword
      };

      // Save updated users back to localStorage
      localStorage.setItem('translatorAppUsers', JSON.stringify(users));

      // Update local user state
      setUser(users[userIndex]);

      // Show success message
      setPasswordSuccess('Password changed successfully!');
      
      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Close modal after a short delay
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setPasswordSuccess('');
      }, 2000);

    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
  };

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
  
  {/* Buttons Container - Side by Side */}
  <div className="buttons-container">
    <button
      onClick={() => setShowChangePasswordModal(true)}
      className="change-password-button"
    >
      <Lock className="w-4 h-4 mr-2" />
      Change Password
    </button>
    
    <button
      onClick={handleLogout}
      className="logout-button"
    >
      Logout
    </button>
  </div>
</div>
                
        <div className="grid lg:grid-cols-2 gap-8">
          <ProfileCard user={user} />
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Change Password</h2>
              <button
                onClick={closeChangePasswordModal}
                className="modal-close-button"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="modal-body">
              {passwordError && (
                <div className="password-error">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="password-success">
                  {passwordSuccess}
                </div>
              )}

              <div className="password-form-group">
                <label className="password-label">Current Password</label>
                <div className="password-input-container">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                    className="password-input"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="password-toggle-button"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="password-form-group">
                <label className="password-label">New Password</label>
                <div className="password-input-container">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                    className="password-input"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="password-toggle-button"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="password-form-group">
                <label className="password-label">Confirm New Password</label>
                <div className="password-input-container">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                    className="password-input"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="password-toggle-button"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={closeChangePasswordModal}
                className="modal-cancel-button"
                disabled={passwordLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="modal-confirm-button"
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDisplay;