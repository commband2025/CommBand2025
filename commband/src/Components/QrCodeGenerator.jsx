import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, AlertTriangle, QrCode, UserPlus, LogIn, Home, Camera, MessageSquare, Printer } from 'lucide-react';

const QRCodeGenerator = ({ data }) => {
  const generateQRCode = (text) => {
    const size = 150; // Increased size for better print quality
    const qrData = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrData}`;
  };

  // Format the user data as human-readable text instead of JSON
  const formatDataForQR = (user) => {
    let formattedText = '';
    
    if (user.name) formattedText += `Name: ${user.name}\n`;
    if (user.age) formattedText += `Age: ${user.age}\n`;
    if (user.userType) formattedText += `User Type: ${user.userType}\n`;
    if (user.preferredLanguage) formattedText += `Preferred Language: ${user.preferredLanguage}\n`;
    
    if (user.emergencyContact) {
      formattedText += `\nEmergency Contact:\n`;
      if (user.emergencyContact.name) formattedText += `  Name: ${user.emergencyContact.name}\n`;
      if (user.emergencyContact.relationship) formattedText += `  Relationship: ${user.emergencyContact.relationship}\n`;
      if (user.emergencyContact.phone) formattedText += `  Phone: ${user.emergencyContact.phone}\n`;
    }
    
    if (user.medicalInfo) {
      formattedText += `\nMedical Information:\n`;
      if (user.medicalInfo.condition) formattedText += `  Condition: ${user.medicalInfo.condition}\n`;
      if (user.medicalInfo.allergies) formattedText += `  Allergies: ${user.medicalInfo.allergies}\n`;
      if (user.medicalInfo.notes) formattedText += `  Notes: ${user.medicalInfo.notes}\n`;
    }
    
    if (user.id) {
      formattedText += `\nProfile Link: comm-band2025-76il.vercel.app/profile/${user.id}\n`;
    }
    
    return formattedText.trim();
  };

  const qrData = formatDataForQR(data);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const qrImageSrc = generateQRCode(qrData);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code - ${data.name || 'Profile'}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
            color: black;
          }
          
          .print-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 100%;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
            width: 100%;
          }
          
          .title {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 10px 0;
          }
          
          .subtitle {
            font-size: 16px;
            color: #666;
            margin: 0;
          }
          
          .qr-section {
            display: flex;
            align-items: flex-start;
            gap: 30px;
            margin-bottom: 30px;
            width: 100%;
            justify-content: center;
          }
          
          .qr-code {
            border: 3px solid #000;
            border-radius: 10px;
            background: white;
            padding: 10px;
          }
          
          .qr-info {
            flex: 1;
            max-width: 300px;
          }
          
          .info-section {
            margin-bottom: 20px;
          }
          
          .info-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #333;
          }
          
          .info-content {
            font-size: 14px;
            line-height: 1.5;
            white-space: pre-line;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ddd;
          }
          
          .instructions {
            background: #f0f8ff;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #b0d4ff;
            margin-top: 20px;
            width: 100%;
          }
          
          .instructions h3 {
            margin: 0 0 10px 0;
            color: #0066cc;
          }
          
          .instructions p {
            margin: 5px 0;
            font-size: 14px;
          }
          
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
          
          @media print {
            .no-print {
              display: none !important;
            }
            
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <h1 class="title">Personal QR Code</h1>
            <p class="subtitle">${data.name || 'Profile Information'}</p>
          </div>
          
          <div class="qr-section">
            <div>
              <img src="${qrImageSrc}" alt="QR Code" class="qr-code" />
            </div>
            
            <div class="qr-info">
              <div class="info-section">
                <h3 class="info-title">Encoded Information:</h3>
                <div class="info-content">${qrData}</div>
              </div>
            </div>
          </div>
          
          <div class="instructions">
            <h3>How to Use This QR Code:</h3>
            <p>1. Use any QR code scanner app on your smartphone</p>
            <p>2. Point the camera at the QR code above</p>
            <p>3. The encoded information will be displayed</p>
            <p>4. Keep this printout in a safe, accessible location</p>
          </div>
          
          <div class="footer">
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Keep this information updated and secure</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = generateQRCode(qrData);
    link.download = `qr-code-${data.name || 'profile'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      maxWidth: '500px',
      margin: '0 auto'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#1f2937',
      textAlign: 'center'
    },
    qrImage: {
      border: '3px solid #e5e7eb',
      borderRadius: '12px',
      backgroundColor: 'white',
      padding: '8px',
      marginBottom: '20px'
    },
    description: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '20px',
      textAlign: 'center',
      lineHeight: '1.5'
    },
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      width: '100%'
    },
    button: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out'
    },
    printButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      ':hover': {
        backgroundColor: '#2563eb'
      }
    },
    downloadButton: {
      backgroundColor: '#10b981',
      color: 'white',
      ':hover': {
        backgroundColor: '#059669'
      }
    }
  };
   
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Your QR Code</h3>
      <img 
        src={generateQRCode(qrData)}
        alt="QR Code"
        style={styles.qrImage}
      />
      
      <div style={styles.buttonContainer}>
        <button 
          style={{...styles.button, ...styles.printButton}}
          onClick={handlePrint}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          <Printer size={18} />
          Print QR Code
        </button>
        
       
      </div>
      

    </div>
  );
};

export default QRCodeGenerator;