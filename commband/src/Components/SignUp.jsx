import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, AlertTriangle, QrCode, UserPlus, LogIn, Home, Camera, MessageSquare } from 'lucide-react';
import '../CSS/SignUp.css'; 
import ProfileCard from './ProfileCard';
import ClearStorageButton from './ClearStorageButton';

// Mock users data - same as in Login component
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

// Signup Component
const loginIcon = "/COMMBAND_Icon.jpg";
const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    userType: '',
    preferredLanguage: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    medicalInfo: {
      condition: '',
      allergies: '',
      notes: ''
    },
    phrases: ['', '', '', '']
  });

  const [showQR, setShowQR] = useState(false);
  const [newUser, setNewUser] = useState(null);

  // Initialize localStorage with mock users if not present
  useEffect(() => {
    const storedUsers = localStorage.getItem('translatorAppUsers');
    if (!storedUsers) {
      localStorage.setItem('translatorAppUsers', JSON.stringify(mockUsers));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhraseChange = (index, value) => {
    const newPhrases = [...formData.phrases];
    newPhrases[index] = value;
    setFormData(prev => ({
      ...prev,
      phrases: newPhrases
    }));
  };

  const generateUniqueId = (existingUsers) => {
    const existingIds = existingUsers.map(user => user.id);
    let newId = 1;
    while (existingIds.includes(newId)) {
      newId++;
    }
    return newId;
  };

  const handleSubmit = () => {
    // Comprehensive validation for all required fields
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      alert('Please fill in all account credential fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (!formData.name || !formData.age || !formData.userType || !formData.preferredLanguage) {
      alert('Please fill in all personal information fields');
      return;
    }

    // Validate emergency contact fields
    if (!formData.emergencyContact.name || !formData.emergencyContact.relationship || !formData.emergencyContact.phone) {
      alert('Please fill in all emergency contact fields');
      return;
    }

    // Validate medical information fields
    if (!formData.medicalInfo.condition || !formData.medicalInfo.allergies || !formData.medicalInfo.notes) {
      alert('Please fill in all medical information fields');
      return;
    }

    // Validate that all phrases are filled
    const emptyPhrases = formData.phrases.filter(phrase => phrase.trim() === '');
    if (emptyPhrases.length > 0) {
      alert('Please fill in all communication phrases');
      return;
    }

    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('translatorAppUsers') || '[]');
      
      // Check if username already exists
      const existingUser = existingUsers.find(user => user.email === formData.username);
      if (existingUser) {
        alert('Username already exists. Please choose a different username.');
        return;
      }

      // Generate unique ID
      const newId = generateUniqueId(existingUsers);

      // Create new user object
      const userToAdd = {
        id: newId,
        name: formData.name,
        age: parseInt(formData.age),
        userType: formData.userType,
        preferredLanguage: formData.preferredLanguage,
        email: formData.username, // Using username as email for login
        password: formData.password,
        emergencyContact: {
          name: formData.emergencyContact.name,
          relationship: formData.emergencyContact.relationship,
          phone: formData.emergencyContact.phone
        },
        medicalInfo: {
          condition: formData.medicalInfo.condition,
          allergies: formData.medicalInfo.allergies,
          notes: formData.medicalInfo.notes
        },
        phrases: formData.phrases, // All phrases are now required
        photo: "/api/placeholder/150/150" // Default placeholder photo
      };

      // Add new user to existing users array
      const updatedUsers = [...existingUsers, userToAdd];
      
      // Store updated users array in localStorage
      localStorage.setItem('translatorAppUsers', JSON.stringify(updatedUsers));

      // Set the new user for display
      setNewUser(userToAdd);
      
      // Show success screen
      setShowQR(true);

    } catch (error) {
      console.error('Error saving user:', error);
      alert('Registration failed. Please try again.');
    }
  };

  if (showQR) {
    return (
      <div className="signup-success">
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div className="signup-card">
            <div className="signup-success-header">
              <h1 className="signup-success-title">Registration Complete!</h1>
              <p className="signup-success-subtitle">Your profile has been created successfully!</p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem 0'
            }}>
              <div style={{ width: '100%', maxWidth: '80%' }}>
                <ProfileCard user={newUser || formData} />
              </div>
            </div>
            
            <div className="signup-success-actions">
              <button
                onClick={() => navigate('/login')}
                className="signup-btn signup-btn-primary"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <ClearStorageButton />
        <div className="signup-card">
          <div className="signup-header">
            <img src={loginIcon} alt="Login Icon" className="login-icon"/>
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Fill in your information to get started</p>
          </div>

          <form className="signup-form">
            {/* Account Credentials */}
            <div className="signup-section">
              <h3 className="signup-section-title">Account Credentials</h3>
              <div className="signup-section-grid">
                <div className="signup-field">
                  <label className="signup-label">Username/Email *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="signup-input"
                    placeholder="Choose a username or email"
                    required
                  />
                </div>

                <div className="signup-field">
                  <label className="signup-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="signup-input"
                    placeholder="Choose a password (min 6 characters)"
                    required
                  />
                </div>
              </div>

              <div className="signup-field signup-field-full">
                <label className="signup-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="signup-input"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="signup-section">
              <h3 className="signup-section-title">Personal Information</h3>
              <div className="signup-section-grid">
                <div className="signup-field">
                  <label className="signup-label">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="signup-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="signup-field">
                  <label className="signup-label">Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="signup-input"
                    placeholder="Enter your age"
                    required
                  />
                </div>
              </div>

              <div className="signup-section-grid">
                <div className="signup-field">
                  <label className="signup-label">User Type *</label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="signup-select"
                    required
                  >
                    <option value="">Select user type</option>
                    <option value="PWD - Non-verbal User">PWD - Non-verbal User</option>
                    <option value="Deaf User">Deaf User</option>
                    <option value="Able/Tourist">Able/Tourist</option>
                  </select>
                </div>

                <div className="signup-field">
                  <label className="signup-label">Preferred Language *</label>
                  <input
                    type="text"
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    className="signup-input"
                    placeholder="e.g., English, Filipino, etc."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="signup-section">
              <h3 className="signup-section-title">Emergency Contact</h3>
              <div className="signup-section-grid">
                <div className="signup-field">
                  <label className="signup-label">Contact Name *</label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleInputChange}
                    className="signup-input"
                    placeholder="Emergency contact name"
                    required
                  />
                </div>

                <div className="signup-field">
                  <label className="signup-label">Relationship *</label>
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleInputChange}
                    className="signup-input"
                    placeholder="e.g., Mother, Father, Spouse"
                    required
                  />
                </div>
              </div>

              <div className="signup-field signup-field-full">
                <label className="signup-label">Phone Number *</label>
                <input
                  type="tel"
                  name="emergencyContact.phone"
                  value={formData.emergencyContact.phone}
                  onChange={handleInputChange}
                  className="signup-input"
                  placeholder="Emergency contact phone number"
                  required
                />
              </div>
            </div>

            {/* Medical Information Section */}
            <div className="signup-section">
              <h3 className="signup-section-title">Medical Information</h3>
              <div className="signup-section-grid">
                <div className="signup-field">
                  <label className="signup-label">Condition *</label>
                  <input
                    type="text"
                    name="medicalInfo.condition"
                    value={formData.medicalInfo.condition}
                    onChange={handleInputChange}
                    className="signup-input"
                    placeholder="Medical condition (enter 'None' if none)"
                    required
                  />
                </div>

                <div className="signup-field">
                  <label className="signup-label">Allergies *</label>
                  <input
                    type="text"
                    name="medicalInfo.allergies"
                    value={formData.medicalInfo.allergies}
                    onChange={handleInputChange}
                    className="signup-input"
                    placeholder="Known allergies (enter 'None' if none)"
                    required
                  />
                </div>
              </div>

              <div className="signup-field signup-field-full">
                <label className="signup-label">Additional Notes *</label>
                <textarea
                  name="medicalInfo.notes"
                  value={formData.medicalInfo.notes}
                  onChange={handleInputChange}
                  className="signup-textarea"
                  placeholder="Any additional medical information (enter 'None' if none)..."
                  required
                />
              </div>
            </div>

            {/* Pre-set Communication Phrases Section */}
            <div className="signup-section">
              <h3 className="signup-section-title">Pre-set Communication Phrases</h3>
              <div className="signup-phrases">
                {formData.phrases.map((phrase, index) => (
                  <div key={index} className="signup-phrase-field">
                    <label className="signup-label">Phrase {index + 1} *</label>
                    <input
                      type="text"
                      value={phrase}
                      onChange={(e) => handlePhraseChange(index, e.target.value)}
                      className="signup-input"
                      placeholder={`Enter phrase ${index + 1}...`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="signup-actions">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="signup-btn signup-btn-outline"
              >
                Back to Login
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="signup-btn signup-btn-primary"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;