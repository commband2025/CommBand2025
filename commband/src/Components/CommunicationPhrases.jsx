import React, { useState, useEffect } from 'react';
import { MessageSquare, Volume2, Globe, AlertCircle, Edit3, Save, X, Plus, Trash2, Download, Upload } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import '/src/CSS/CommunicationPhrases.css';

const CommunicationPhrases = ({ phrases: initialPhrases = [], userLanguage = 'en' ,apiKey = 'AIzaSyCpAB2SiD3Ck7w_7V03ApEN3ThEud-EH_c', userId = null }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(userLanguage);
  const [phrases, setPhrases] = useState(initialPhrases);
  const [translatedPhrases, setTranslatedPhrases] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPhraseText, setNewPhraseText] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState(apiKey);
  const [genAI, setGenAI] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [currentModel, setCurrentModel] = useState('gemini-1.5-flash');

  // localStorage keys for the app
  const USERS_STORAGE_KEY = 'translatorAppUsers';
  const CURRENT_USER_KEY = 'currentUser';

  // Available FREE models in order of preference (fastest to most capable)
  const availableModels = [
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash',
    'gemini-pro'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'hi', name: 'Hindi' },
    { code: 'tl', name: 'Filipino' },
    { code: 'vi', name: 'Vietnamese' }
  ];

  // Function to save phrases to localStorage (update user's phrases in translatorAppUsers)
  const savePhrases = (newPhrases) => {
    try {
      // Get current user to determine which user's phrases to update
      const currentUser = localStorage.getItem(CURRENT_USER_KEY);
      if (!currentUser) return;
      
      const user = JSON.parse(currentUser);
      const targetUserId = userId || user.id;
      
      // Get all users from localStorage
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) return;
      
      const users = JSON.parse(storedUsers);
      
      // Find and update the specific user's phrases
      const updatedUsers = users.map(u => {
        if (u.id === targetUserId) {
          return { ...u, phrases: newPhrases };
        }
        return u;
      });
      
      // Save updated users back to localStorage
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      // Update current user session if it's the current user being updated
      if (targetUserId === user.id) {
        const updatedCurrentUser = { ...user, phrases: newPhrases };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedCurrentUser));
      }
      
    } catch (error) {
      console.error('Error saving phrases to localStorage:', error);
    }
  };

  // Function to load phrases from localStorage (get user's phrases from translatorAppUsers)
  const loadPhrases = () => {
    try {
      // Get current user to determine which user's phrases to load
      const currentUser = localStorage.getItem(CURRENT_USER_KEY);
      if (!currentUser) return [];
      
      const user = JSON.parse(currentUser);
      const targetUserId = userId || user.id;
      
      // Get all users from localStorage
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) return [];
      
      const users = JSON.parse(storedUsers);
      
      // Find the specific user and return their phrases
      const targetUser = users.find(u => u.id === targetUserId);
      return targetUser ? targetUser.phrases || [] : [];
      
    } catch (error) {
      console.error('Error loading phrases from localStorage:', error);
      return [];
    }
  };

  // Initialize Gemini AI when API key is provided
  useEffect(() => {
    if (geminiApiKey.trim()) {
      try {
        const ai = new GoogleGenerativeAI(geminiApiKey);
        setGenAI(ai);
        setIsConfigured(true);
        setTranslationError(null);
      } catch (error) {
        console.error('Error initializing Gemini AI:', error);
        setTranslationError('Failed to initialize Gemini AI. Please check your API key.');
        setIsConfigured(false);
      }
    } else {
      setGenAI(null);
      setIsConfigured(false);
    }
  }, [geminiApiKey]);

  // Load phrases from localStorage on component mount, fallback to props
  useEffect(() => {
    const storedPhrases = loadPhrases();
    if (storedPhrases.length > 0) {
      setPhrases(storedPhrases);
    } else {
      setPhrases(initialPhrases);
    }
  }, [initialPhrases]);

  // Reset translations when phrases change
  useEffect(() => {
    setTranslatedPhrases([]);
    if (selectedLanguage !== 'en' && isConfigured) {
      handleLanguageChange(selectedLanguage);
    }
  }, [phrases, isConfigured]);

  // Enhanced translation function with model fallback
  const translateText = async (text, targetLanguage, sourceLanguage = 'en') => {
    if (targetLanguage === sourceLanguage) return text;
    
    if (!genAI) {
      throw new Error('Gemini AI is not configured. Please provide an API key.');
    }

    const targetLanguageName = languages.find(lang => lang.code === targetLanguage)?.name || targetLanguage;
    const sourceLanguageName = languages.find(lang => lang.code === sourceLanguage)?.name || sourceLanguage;

    const prompt = `Translate the following text from ${sourceLanguageName} to ${targetLanguageName}. Only return the translated text, nothing else:

"${text}"`;

    // Try each model in order until one works
    for (let i = 0; i < availableModels.length; i++) {
      const modelName = availableModels[i];
      
      try {
        console.log(`Attempting translation with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1000,
            topP: 0.1,
            topK: 16,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text().trim();
        
        if (!translatedText) {
          throw new Error('No translation received from Gemini AI');
        }

        setCurrentModel(modelName);
        return translatedText.replace(/^["']|["']$/g, '');
        
      } catch (error) {
        console.error(`Error with model ${modelName}:`, error);
        
        // Check if it's a quota/overload error
        if (error.message.includes('quota') || 
            error.message.includes('overloaded') || 
            error.message.includes('rate limit') ||
            error.message.includes('429')) {
          
          // If not the last model, try next one
          if (i < availableModels.length - 1) {
            console.log(`Model ${modelName} is overloaded, trying next model...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            continue;
          }
        }
        
        // If it's the last model or a different error, throw it
        if (i === availableModels.length - 1) {
          throw new Error(`All models failed. Last error: ${error.message}`);
        }
      }
    }
  };

  // Enhanced batch translate with model fallback
  const translateMultipleTexts = async (texts, targetLanguage, sourceLanguage = 'en') => {
    if (targetLanguage === sourceLanguage) return texts;
    
    if (!genAI) {
      throw new Error('Gemini AI is not configured. Please provide an API key.');
    }

    const targetLanguageName = languages.find(lang => lang.code === targetLanguage)?.name || targetLanguage;
    const sourceLanguageName = languages.find(lang => lang.code === sourceLanguage)?.name || sourceLanguage;

    const numberedTexts = texts.map((text, index) => `${index + 1}. "${text}"`).join('\n');
    
    const prompt = `Translate the following numbered phrases from ${sourceLanguageName} to ${targetLanguageName}. Return only the translated phrases in the same numbered format, nothing else:

${numberedTexts}`;

    // Try each model in order until one works
    for (let i = 0; i < availableModels.length; i++) {
      const modelName = availableModels[i];
      
      try {
        console.log(`Attempting batch translation with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2000,
            topP: 0.1,
            topK: 16,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text().trim();
        
        if (!translatedText) {
          throw new Error('No translation received from Gemini AI');
        }

        const translatedLines = translatedText.split('\n').filter(line => line.trim());
        const translatedPhrases = translatedLines.map(line => {
          return line.replace(/^\d+\.\s*["']?|["']?$/g, '').trim();
        });

        if (translatedPhrases.length !== texts.length) {
          console.warn('Batch translation parsing failed, falling back to individual translations');
          return Promise.all(texts.map(text => translateText(text, targetLanguage, sourceLanguage)));
        }

        setCurrentModel(modelName);
        return translatedPhrases;
        
      } catch (error) {
        console.error(`Batch translation error with model ${modelName}:`, error);
        
        // Check if it's a quota/overload error
        if (error.message.includes('quota') || 
            error.message.includes('overloaded') || 
            error.message.includes('rate limit') ||
            error.message.includes('429')) {
          
          // If not the last model, try next one
          if (i < availableModels.length - 1) {
            console.log(`Model ${modelName} is overloaded, trying next model...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            continue;
          }
        }
        
        // If it's the last model or a different error, fall back to individual translations
        if (i === availableModels.length - 1) {
          console.warn('All models failed for batch translation, falling back to individual translations');
          return Promise.all(texts.map(text => translateText(text, targetLanguage, sourceLanguage)));
        }
      }
    }
  };

  const handleLanguageChange = async (languageCode) => {
    if (!isConfigured) {
      setTranslationError('Please configure Gemini AI first by providing an API key.');
      return;
    }

    setSelectedLanguage(languageCode);
    setIsTranslating(true);
    setTranslationError(null);
    
    try {
      const translated = await translateMultipleTexts(phrases, languageCode);
      setTranslatedPhrases(translated);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslationError(`Translation failed: ${error.message}`);
      setTranslatedPhrases(phrases);
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(selectedLanguage)) || voices[0];
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.lang = selectedLanguage;
      utterance.rate = 0.8;
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  const handlePhraseClick = (phrase) => {
    if (editingIndex === null) {
      speakText(phrase);
    }
  };

  const startEditing = (index, currentText) => {
    setEditingIndex(index);
    setEditingText(currentText);
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      const newPhrases = [...phrases];
      newPhrases[editingIndex] = editingText.trim();
      setPhrases(newPhrases);
      savePhrases(newPhrases); // Save to localStorage
    }
    setEditingIndex(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  const deletePhrase = (index) => {
    const newPhrases = phrases.filter((_, i) => i !== index);
    setPhrases(newPhrases);
    savePhrases(newPhrases); // Save to localStorage
  };

  const addNewPhrase = () => {
    if (newPhraseText.trim()) {
      const newPhrases = [...phrases, newPhraseText.trim()];
      setPhrases(newPhrases);
      savePhrases(newPhrases); // Save to localStorage
      setNewPhraseText('');
      setIsAddingNew(false);
    }
  };

  const cancelAddNew = () => {
    setNewPhraseText('');
    setIsAddingNew(false);
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const displayPhrases = translatedPhrases.length > 0 ? translatedPhrases : phrases;

  return (
    <div className="communication-phrases">
      <div className="header">
        <div className="title-section">
          <h3 className="title">
            <MessageSquare size={20} />
            Editable Communication Phrases
          </h3>
          <p className="subtitle">
            Click any phrase to speak it, or edit to customize
            {isConfigured && currentModel && (
              <span className="model-info"> • Using: {currentModel}</span>
            )}
          </p>
        </div>
        
        <div className="language-selector">
          <Globe size={16} className="text-gray-600" />
          <select 
            value={selectedLanguage} 
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={isTranslating || !isConfigured}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {!isConfigured && (
        <div className="api-config">
          <div className="config-header">
            <AlertCircle size={16} className="text-blue-600" />
            <span>Configure Gemini AI (Free Models Only)</span>
          </div>
          <p className="config-description">
            This component uses only free Gemini models: gemini-1.5-flash-8b, gemini-1.5-flash, and gemini-pro with automatic fallback.
          </p>
          <div className="config-steps">
            <div className="step">
              <strong>Step 1:</strong> Install the Gemini AI package
              <code className="install-code">npm install @google/generative-ai</code>
            </div>
            <div className="step">
              <strong>Step 2:</strong> Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
            </div>
            <div className="step">
              <strong>Step 3:</strong> Enter your API key below
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="api-key-input"
              />
            </div>
          </div>
        </div>
      )}
      
      {translationError && (
        <div className="error-message">
          <p>Translation error: {translationError}</p>
        </div>
      )}
      
      <div className="phrases-container">
        {phrases.length === 0 ? (
          <div className="empty-state">
            <MessageSquare className="empty-state-icon" />
            <p>No phrases available</p>
            <p className="empty-state-subtitle">Pass phrases through props or add new ones to get started</p>
          </div>
        ) : isTranslating ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            Translating with {currentModel || 'free models'}...
          </div>
        ) : (
          <>
            {displayPhrases.map((phrase, index) => (
              <div key={index} className="phrase-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem 1.25rem',  backgroundColor: editingIndex === index ? '#ccfbf1' : '#f0fdfa', border: editingIndex === index ? '1px solid #20b2aa' : '1px solid #5eead4', borderRadius: '0.75rem', cursor: editingIndex === index ? 'default' : 'pointer', transition: 'all 0.2s ease', minHeight: '60px', boxShadow: '0 1px 3px rgba(32, 178, 170, 0.1)' }}>
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      style={{ flex: 1, padding: '8px', border: '1px solid #5eead4', borderRadius: '4px', backgroundColor: '#ffffff', color: '#134e4a'}}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          saveEdit();
                        } else if (e.key === 'Escape') {
                          cancelEdit();
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      style={{ padding: '6px',backgroundColor: '#20b2aa', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{ padding: '6px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <span 
                      className="phrase-text"
                      style={{ flex: 1, cursor: 'pointer', padding: '8px' }}
                      onClick={() => handlePhraseClick(phrase)}
                    >
                      {phrase}
                    </span>
                    <button
                      onClick={() => startEditing(index, phrases[index])}
                      style={{ padding: '6px', backgroundColor: '#20b2aa', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'  }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => deletePhrase(index)}
                      style={{ padding: '6px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            ))}
            
            {isAddingNew ? (
              <div className="phrase-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem 1.25rem', backgroundColor: '#ccfbf1', border: '1px solid #20b2aa', borderRadius: '0.75rem', cursor: 'default', transition: 'all 0.2s ease', minHeight: '60px', boxShadow: '0 1px 3px rgba(32, 178, 170, 0.1)' }}>
                <input
                  type="text"
                  value={newPhraseText}
                  onChange={(e) => setNewPhraseText(e.target.value)}
                  placeholder="Enter new phrase..."
                  style={{ flex: 1, padding: '8px', border: '1px solid #5eead4', borderRadius: '4px', backgroundColor: '#ffffff', color: '#134e4a'}}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addNewPhrase();
                    } else if (e.key === 'Escape') {
                      cancelAddNew();
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={addNewPhrase}
                  style={{ padding: '6px', backgroundColor: '#20b2aa', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={cancelAddNew}
                  style={{ padding: '6px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingNew(true)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '1rem 1.25rem', backgroundColor: '#f0fdfa', color: '#0f766e', border: '1px dashed #20b2aa', borderRadius: '0.75rem', cursor: 'pointer', minHeight: '60px', transition: 'all 0.2s ease'  }}
              >
                <Plus size={16} />
                Add New Phrase
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunicationPhrases;