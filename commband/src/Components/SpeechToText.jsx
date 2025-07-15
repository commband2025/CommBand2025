import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, Trash2, Volume2 } from 'lucide-react';

export default function SpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript(interimTranscript);
      };
      
      recognition.onerror = (event) => {
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const speakText = () => {
    if ('speechSynthesis' in window && transcript) {
      const utterance = new SpeechSynthesisUtterance(transcript);
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <div style={styles.errorContainer}>
        <h3 style={styles.errorTitle}>Not Supported</h3>
        <p style={styles.errorText}>
          Please use Chrome, Safari, or Edge.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        <h2 style={styles.title}>Speech to Text</h2>
        
        {/* Control Panel */}
        <div style={styles.controlPanel}>
          <button
            onClick={isListening ? stopListening : startListening}
            style={{
              ...styles.micButton,
              ...(isListening ? styles.micButtonActive : styles.micButtonInactive)
            }}
          >
            {isListening ? (
              <MicOff size={20} color="white" />
            ) : (
              <Mic size={20} color="white" />
            )}
            
            {/* Pulsing animation when listening */}
            {isListening && (
              <div style={styles.pulseAnimation}></div>
            )}
          </button>
          
          <span style={{
            ...styles.statusText,
            color: isListening ? '#ef4444' : '#6b7280'
          }}>
            {isListening ? 'Listening...' : 'Click to start'}
          </span>
        </div>

        {/* Error Display */}
        {error && (
          <div style={styles.errorDisplay}>
            <p style={styles.errorMessage}>{error}</p>
          </div>
        )}

        {/* Transcript Display */}
        <div style={styles.transcriptBox}>
          {transcript || interimTranscript ? (
            <div style={styles.transcriptContent}>
              <span style={styles.finalText}>{transcript}</span>
              <span style={styles.interimText}>{interimTranscript}</span>
              {isListening && <span style={styles.cursor}></span>}
            </div>
          ) : (
            <div style={styles.placeholderContent}>
              <Mic size={24} style={styles.placeholderIcon} />
              <p style={styles.placeholderText}>Start speaking...</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button
            onClick={copyToClipboard}
            disabled={!transcript}
            style={{
              ...styles.actionButton,
              ...styles.copyButton,
              ...(transcript ? {} : styles.disabledButton)
            }}
          >
            <Copy size={12} style={{ marginRight: '6px' }} />
            Copy
          </button>
          
          <button
            onClick={speakText}
            disabled={!transcript}
            style={{
              ...styles.actionButton,
              ...styles.speakButton,
              ...(transcript ? {} : styles.disabledButton)
            }}
          >
            <Volume2 size={12} style={{ marginRight: '6px' }} />
            Speak
          </button>
          
          <button
            onClick={clearTranscript}
            disabled={!transcript && !interimTranscript}
            style={{
              ...styles.actionButton,
              ...styles.clearButton,
              ...(transcript || interimTranscript ? {} : styles.disabledButton)
            }}
          >
            <Trash2 size={12} style={{ marginRight: '6px' }} />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '700px',
    height: '320px',
    margin: '10px',
    padding: '8px',
    backgroundColor: '#f3f4f6',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  mainCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e5e7eb'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px',
    textAlign: 'center'
  },
  controlPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  micButton: {
    position: 'relative',
    padding: '12px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  micButtonInactive: {
    backgroundColor: '#10b981',
    '&:hover': {
      backgroundColor: '#059669'
    }
  },
  micButtonActive: {
    backgroundColor: '#ef4444',
    '&:hover': {
      backgroundColor: '#dc2626'
    }
  },
  pulseAnimation: {
    position: 'absolute',
    inset: '-4px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    animation: 'pulse 2s infinite',
    opacity: '0.3'
  },
  statusText: {
    fontSize: '12px',
    fontWeight: '500',
    textAlign: 'center'
  },
  errorContainer: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: 'white',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  errorTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: '12px'
  },
  errorText: {
    fontSize: '14px',
    color: '#dc2626'
  },
  errorDisplay: {
    marginBottom: '12px',
    padding: '8px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px'
  },
  errorMessage: {
    fontSize: '11px',
    color: '#b91c1c',
    textAlign: 'center'
  },
  transcriptBox: {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '12px',
    minHeight: '100px',
    maxHeight: '120px',
    overflowY: 'auto',
    border: '1px solid #e5e7eb',
    flex: 1,
    marginBottom: '12px'
  },
  transcriptContent: {
    color: '#374151',
    lineHeight: '1.4',
    fontSize: '13px'
  },
  finalText: {
    color: '#111827'
  },
  interimText: {
    color: '#9ca3af',
    fontStyle: 'italic'
  },
  cursor: {
    display: 'inline-block',
    width: '2px',
    height: '16px',
    backgroundColor: '#10b981',
    marginLeft: '2px',
    animation: 'blink 1s infinite'
  },
  placeholderContent: {
    color: '#9ca3af',
    textAlign: 'center',
    paddingTop: '20px'
  },
  placeholderIcon: {
    margin: '0 auto 8px',
    opacity: '0.5',
    color: '#10b981'
  },
  placeholderText: {
    margin: '0',
    fontSize: '12px'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '12px',
    fontWeight: '500',
    minWidth: '70px',
    height: '50px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  },
  copyButton: {
    backgroundColor: '#10b981',
    color: 'white',
    '&:hover': {
      backgroundColor: '#059669'
    }
  },
  speakButton: {
    backgroundColor: '#10b981',
    color: 'white',
    '&:hover': {
      backgroundColor: '#059669'
    }
  },
  clearButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    '&:hover': {
      backgroundColor: '#4b5563'
    }
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    cursor: 'not-allowed',
    opacity: '0.6'
  }
};

// CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { 
      transform: scale(1); 
      opacity: 0.3; 
    }
    50% { 
      transform: scale(1.05); 
      opacity: 0.1; 
    }
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;
document.head.appendChild(styleSheet);