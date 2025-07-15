import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Mail, MapPin, AlertTriangle, QrCode, UserPlus, LogIn, Home, Camera, Upload } from 'lucide-react';
import '/src/CSS/ProfileCard.css';
import QRCodeGenerator from '/src/Components/QrCodeGenerator';
import CommunicationPhrases from '/src/Components/CommunicationPhrases';
import SpeechToText from '/src/Components/SpeechToText';

const ProfileCard = ({ user }) => {
  const [imageError, setImageError] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false);
    setCurrentUser(user);
  }, [user]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    // Create FileReader to convert image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const base64Image = e.target.result;
        
        // Update current user state
        const updatedUser = {
          ...currentUser,
          photo: base64Image
        };
        setCurrentUser(updatedUser);
        setImageError(false);

        // Update localStorage with new image
        updateUserInStorage(updatedUser);
        
        setIsUploading(false);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const updateUserInStorage = (updatedUser) => {
    try {
      // Update users array in localStorage
      const storedUsers = localStorage.getItem('translatorAppUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const userIndex = users.findIndex(u => u.id === updatedUser.id);
        
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('translatorAppUsers', JSON.stringify(users));
        }
      }

      // Update current user session
      const currentUserSession = localStorage.getItem('currentUser');
      if (currentUserSession) {
        const sessionUser = JSON.parse(currentUserSession);
        if (sessionUser.id === updatedUser.id) {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error updating user in storage:', error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    const updatedUser = {
      ...currentUser,
      photo: null
    };
    setCurrentUser(updatedUser);
    setImageError(false);
    updateUserInStorage(updatedUser);
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-left-section">
          <div className="profile-avatar">
            <div className="avatar-container">
              {currentUser.photo && !imageError ? (
                <img 
                  src={currentUser.photo} 
                  alt={`${currentUser.name}'s profile`}
                  className="avatar-image"
                  onError={handleImageError}
                />
              ) : (
                <User size={64} className="avatar-icon" />
              )}
              
              {/* Upload overlay */}
              <div className="avatar-overlay">
                <button 
                  onClick={triggerFileInput}
                  className="avatar-upload-btn"
                  disabled={isUploading}
                  title="Upload new image"
                >
                  {isUploading ? (
                    <div className="upload-spinner"></div>
                  ) : (
                    <Camera size={20} />
                  )}
                </button>
                
                {currentUser.photo && !imageError && (
                  <button 
                    onClick={removeImage}
                    className="avatar-remove-btn"
                    title="Remove image"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden-file-input"
            />
          </div>
          
          <div className="profile-basic-info">
            <h1 className="profile-name">{currentUser.name}</h1>
            <p className="profile-age">Age: {currentUser.age}</p>
            <div className="user-type-badge">
              <span className="user-type-text">{currentUser.userType}</span>
            </div>
            <p className="profile-language">Preferred Language: {currentUser.preferredLanguage}</p>
          </div>
        </div>
        
        <div className="profile-right-section">
          <div className="content-grid">
            <div className="section emergency-contact">
              <h3 className="section-title">
                <Phone size={20} />
                Emergency Contact
              </h3>
              <p className="contact-name">{currentUser.emergencyContact.name}</p>
              <p className="contact-relationship">{currentUser.emergencyContact.relationship}</p>
              <p className="contact-phone">{currentUser.emergencyContact.phone}</p>
            </div>
            
            <div className="section medical-info">
              <h3 className="section-title">
                <AlertTriangle size={20} />
                Medical Information
              </h3>
              <p className="medical-condition">{currentUser.medicalInfo.condition}</p>
              <p className="medical-text"><strong>Allergies:</strong> {currentUser.medicalInfo.allergies}</p>
              <p className="medical-text">{currentUser.medicalInfo.notes}</p>
            </div>
          </div>
        </div>
      </div>
      
      <CommunicationPhrases phrases={currentUser.phrases} />
      
      <div className="profile-footer">
        <SpeechToText />
        
        <div className="qr-section">
          <div className="qr-text">
            <p>Scan QR code for<br />quick access</p>
          </div>
          <QRCodeGenerator data={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;