import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, AlertTriangle, QrCode, UserPlus, LogIn, Home, Camera, MessageSquare } from 'lucide-react';
import '/src/CSS/CommBand.css';
import Login from '/src/Components/Login';
import Signup from '/src/Components/SignUp';
import ProfileDisplay from '/src/Components/Profiledisplay';

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Profile routes with dynamic userId parameter */}
          <Route path="/profile/:userId" element={<ProfileDisplay />} />
          <Route path="/profile" element={<ProfileDisplay />} />
          
          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;