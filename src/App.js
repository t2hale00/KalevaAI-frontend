import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { generateContent, getDownloadUrl, checkHealth } from './services/api';
import './App.css';

// Import newspaper logos
import kalevaLogo from './logos/black/kalevablack.png';
import lapinKansaLogo from './logos/black/lapinkansablack.png';
import ilkkaPohjalainenLogo from './logos/black/ilkkapohjolainenblack.png';
import koillissanomatLogo from './logos/black/koillissanomatblack.png';
import rantalakeusLogo from './logos/black/rantalakeusblack.png';
import iijokiseutuLogo from './logos/black/iijokiseutublack.png';
import raahenSeutuLogo from './logos/black/raahenseutublack.png';
import pyhajokiseutuLogo from './logos/black/pyhäjokiseutublack.png';
import siikajokilaaksoLogo from './logos/black/siikajokilaaksoblack.png';

// Language Switcher Component
function LanguageSwitcher() {
  const { language, switchLanguage } = useLanguage();
  
  return (
    <div className="language-switcher">
      <button 
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => switchLanguage('en')}
        title="English"
      >
        EN
      </button>
      <button 
        className={`lang-btn ${language === 'fi' ? 'active' : ''}`}
        onClick={() => switchLanguage('fi')}
        title="Suomi"
      >
        FI
      </button>
    </div>
  );
}

function AppContent() {
  const { t } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [textContent, setTextContent] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [contentType, setContentType] = useState(''); // 'post' or 'story'
  const [selectedLayout, setSelectedLayout] = useState('');
  const [outputType, setOutputType] = useState(''); // 'static' or 'animated'
  const [selectedNewspaper, setSelectedNewspaper] = useState('');
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [processedContent, setProcessedContent] = useState(null);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [addBanner, setAddBanner] = useState(false);
  const [bannerName, setBannerName] = useState('');
  const [selectedTextLength, setSelectedTextLength] = useState(''); // 'short', 'medium', 'long'
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    platform: false,
    contentType: false,
    layout: false,
    outputType: false,
    newspaper: false,
    contentInput: false,
    category: false
  });
  
  // Category suggestions
  const categorySuggestions = [
    'Uutiset',
    'Matkailu',
    'Mielipiteet',
    'Ihmiset ja ilmiöt',
    'Kulttuuri',
    'Urheilu',
    'Talous',
    'Ympäristö',
    'Paikalliset uutiset',
    'Tiede ja teknologia',
    'Hyvinvointi',
    'Kuva & tarina'
  ];

  // Layout options based on platform and content type
  const getLayoutOptions = () => {
    if (selectedPlatform === 'instagram') {
      if (contentType === 'story') {
        return [t('portrait')];
      } else if (contentType === 'post') {
        return [t('square'), t('portrait')];
      } else {
        // When content type not selected, show all Instagram options
        return [t('square'), t('portrait')];
      }
    } else if (selectedPlatform === 'facebook') {
      if (contentType === 'story') {
        return [t('portrait')]; // Facebook stories only support portrait
      } else if (contentType === 'post') {
        return [t('square'), t('landscape')]; // Facebook posts support square and landscape
      } else {
        // When content type not selected, show all Facebook options
        return [t('square'), t('landscape')];
      }
    } else if (selectedPlatform === 'linkedin') {
      // LinkedIn only supports posts with landscape
      return [t('landscape')];
    }
    return [];
  };

  const newspapers = [
    'Kaleva',
    'Lapin Kansa',
    'Ilkka-Pohjalainen',
    'Koillissanomat',
    'Rantalakeus',
    'Iijokiseutu',
    'Raahen Seutu',
    'Pyhäjokiseutu',
    'Siikajokilaakso'
  ];

  // Check backend health on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await checkHealth();
        setBackendStatus('connected');
      } catch (error) {
        console.error('Backend connection failed:', error);
        setBackendStatus('disconnected');
      }
    };
    checkBackendHealth();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    // Clear contentInput error when files are uploaded
    setFieldErrors(prevErrors => ({ ...prevErrors, contentInput: false }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    multiple: true,
    disabled: uploadedFiles.length > 0  // Disable when files already uploaded
  });

  const handleProcessFiles = async () => {
    setProcessingStatus('processing');
    setError(null);
    
    try {
      // Prepare form data
      const formData = new FormData();
      
      // Map frontend values to backend expected format
      const layoutMap = {
        [t('square')]: 'square',
        [t('portrait')]: 'portrait',
        [t('landscape')]: 'landscape',
        'Square': 'square',
        'Portrait': 'portrait',
        'Landscape': 'landscape'
      };
      
      formData.append('platform', selectedPlatform);
      formData.append('content_type', contentType);
      formData.append('layout', layoutMap[selectedLayout] || selectedLayout.toLowerCase());
      formData.append('output_type', outputType);
      formData.append('newspaper', selectedNewspaper);
      
      if (textContent) {
        formData.append('text_content', textContent);
      }
      
      // Only append text_length for posts (stories don't need it)
      if (contentType === 'post') {
        formData.append('text_length', selectedTextLength || 'medium'); // Default to medium if none selected
      } else {
        formData.append('text_length', 'short'); // Default for stories
      }
      
      // Add banner options
      formData.append('add_banner', addBanner.toString());
      if (addBanner && bannerName.trim()) {
        formData.append('banner_name', bannerName.trim());
      }
      
      // Add image if uploaded
      if (uploadedFiles.length > 0) {
        // Use the first uploaded file
        formData.append('image', uploadedFiles[0].file);
      }
      
      // Call backend API
      const response = await generateContent(formData);
      
      // Update processed content with backend response
      setProcessedContent({
        taskId: response.task_id,
        heading: response.generated_text.heading,
        description: response.generated_text.description,
        headings: response.headings || [response.generated_text.heading],
        descriptions: response.descriptions || [response.generated_text.description],
        graphicUrl: response.graphic_url,
        graphicUrls: response.graphic_urls || [response.graphic_url].filter(Boolean),
        fileFormat: response.file_format,
        dimensions: response.dimensions,
        platform: selectedPlatform,
        contentType: contentType,
        layout: selectedLayout,
        outputType: outputType,
        newspaper: selectedNewspaper,
        message: response.message
      });
      
      setProcessingStatus('completed');
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error.message || 'Failed to generate content. Please try again.');
      setProcessingStatus('error');
    }
  };

  const handleDownload = (graphicUrl = null) => {
    const urlToDownload = graphicUrl || (processedContent && processedContent.graphicUrl);
    if (urlToDownload) {
      // Extract filename from URL
      const filename = urlToDownload.split('/').pop();
      const downloadUrl = getDownloadUrl(filename);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${processedContent.newspaper}_${processedContent.platform}_${processedContent.contentType}.${processedContent.fileFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Reset dependent selections when platform changes
  const handlePlatformChange = (platform) => {
    if (selectedPlatform === platform) {
      setSelectedPlatform(''); // Unselect if clicking the same platform
      setContentType('');
      setSelectedLayout('');
    } else {
      setSelectedPlatform(platform); // Select the new platform
      
      // Auto-select for LinkedIn (only has Post and Landscape)
      if (platform === 'linkedin') {
        setContentType('post');
        setSelectedLayout(t('landscape'));
      } else {
        setContentType('');
        setSelectedLayout('');
      }
    }
    // Clear platform, contentType, and layout errors when platform changes
    setFieldErrors(prev => ({
      ...prev,
      platform: false,
      contentType: false,
      layout: false
    }));
    // Check if all fields are now valid and clear error message
    checkAndClearError();
  };

  // Handle content type changes
  const handleContentTypeChange = (type) => {
    if (contentType === type) {
      setContentType(''); // Unselect if clicking the same content type
    } else {
      setContentType(type); // Select the new content type
      
      // Check if current layout is valid for the new content type
      const validLayouts = getLayoutOptions().map(option => {
        // Convert translated layout names back to keys
        if (option === t('square')) return 'square';
        if (option === t('portrait')) return 'portrait';
        if (option === t('landscape')) return 'landscape';
        return option;
      });
      
      // Reset layout if current selection is not valid for the new content type
      if (selectedLayout && !validLayouts.includes(selectedLayout)) {
        setSelectedLayout('');
      }
    }
    // Clear contentType error when changed
    setFieldErrors(prev => ({ ...prev, contentType: false }));
    // Check if all fields are now valid and clear error message
    checkAndClearError();
  };

  // Handle text length changes
  const handleTextLengthChange = (length) => {
    setSelectedTextLength(length);
  };

  // Handle newspaper selection
  const handleNewspaperChange = (newspaperName) => {
    if (selectedNewspaper === newspaperName) {
      setSelectedNewspaper('');
    } else {
      setSelectedNewspaper(newspaperName);
    }
    // Clear newspaper error when changed
    setFieldErrors(prev => ({ ...prev, newspaper: false }));
    checkAndClearError();
  };

  // Helper function to check if all fields are valid and clear error message
  const checkAndClearError = () => {
    const { missing } = checkMissingFields();
    if (missing.length === 0) {
      setError(null);
    }
  };

  // Effect to clear error when all fields become valid
  useEffect(() => {
    const { missing } = checkMissingFields();
    if (missing.length === 0) {
      setError(null);
    }
  }, [selectedPlatform, contentType, selectedLayout, outputType, selectedNewspaper, uploadedFiles, textContent, addBanner, bannerName, t]);

  // Function to check what's missing
  const checkMissingFields = () => {
    const missing = [];
    const errors = {
      platform: false,
      contentType: false,
      layout: false,
      outputType: false,
      newspaper: false,
      contentInput: false,
      category: false
    };
    
    if (!selectedPlatform) {
      missing.push(t('socialMediaPlatform'));
      errors.platform = true;
    }
    if (!contentType) {
      missing.push(t('contentType'));
      errors.contentType = true;
    }
    if (!selectedLayout) {
      missing.push(t('layoutOptions'));
      errors.layout = true;
    }
    if (!outputType) {
      missing.push(t('outputType'));
      errors.outputType = true;
    }
    if (!selectedNewspaper) {
      missing.push(t('newspaper'));
      errors.newspaper = true;
    }
    if (uploadedFiles.length === 0 && textContent.trim() === '') {
      missing.push(t('uploadImage') + ' / ' + t('textContent'));
      errors.contentInput = true;
    }
    if (addBanner && !bannerName.trim()) {
      missing.push(t('categoryText'));
      errors.category = true;
    }
    
    return { missing, errors };
  };

  // Handle generate button click with validation
  const handleGenerateClick = () => {
    const { missing, errors } = checkMissingFields();
    
    if (missing.length > 0) {
      setError(t('missingFields') + ': ' + missing.join(', '));
      setFieldErrors(errors);
      return;
    }
    
    // Clear any previous errors and proceed
    setError(null);
    setFieldErrors({
      platform: false,
      contentType: false,
      layout: false,
      outputType: false,
      newspaper: false,
      contentInput: false,
      category: false
    });
    handleProcessFiles();
  };

  return (
    <div className="app">
      {/* Full-page processing overlay */}
      {processingStatus === 'processing' && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="processing-spinner"></div>
            <div className="processing-title">{t('processing')}</div>
            <div className="processing-message">
              {t('generatingContent')} {selectedNewspaper} {contentType}...
            </div>
          </div>
        </div>
      )}
      
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1>{t('title')}</h1>
            <p>{t('subtitle')}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="app-main">
        <div className="split-container">
          {/* LEFT SIDE - INPUTS */}
          <div className="input-panel">
            <h2>{t('inputConfiguration')}</h2>
            
            {/* Content Input Container */}
            <div className={`input-container ${fieldErrors.contentInput ? 'error' : ''}`}>
              <h3>{t('contentInput')}</h3>
              <div className="content-input-grid">
                {/* Image Upload */}
                <div className="input-section">
                  <h4>{t('uploadImage')}</h4>
          <div 
            {...getRootProps()} 
            className={`dropzone ${isDragActive ? 'active' : ''} ${uploadedFiles.length > 0 ? 'disabled' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <div className="upload-icon">📁</div>
              <p>
                {uploadedFiles.length > 0
                  ? t('uploadDisabled')
                  : isDragActive 
                    ? t('uploadDragActive')
                    : t('uploadDragText')
                }
              </p>
                      <small>Supports: JPEG, PNG, WebP</small>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
                      <h5>Uploaded Files ({uploadedFiles.length})</h5>
              <div className="files-grid">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="file-item">
                    <div className="file-preview">
                        <img src={file.preview} alt={file.name} />
                    </div>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <button 
                      className="remove-file"
                      onClick={() => {
                        setUploadedFiles(prev => {
                          const updated = prev.filter(f => f.id !== file.id);
                          // If removing file leaves no content, check if error should be set
                          if (updated.length === 0 && textContent.trim() === '') {
                            // Don't clear error if no content remains
                          } else {
                            setFieldErrors(prevErrors => ({ ...prevErrors, contentInput: false }));
                            checkAndClearError();
                          }
                          return updated;
                        });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
            </div>

                {/* Text Input */}
                <div className="input-section">
                  <h4>{t('textContent')}</h4>
                  <textarea
                    value={textContent}
                    onChange={(e) => {
                      setTextContent(e.target.value);
                      // Clear contentInput error when text is entered
                      setFieldErrors(prev => ({ ...prev, contentInput: false }));
                      checkAndClearError();
                    }}
                    placeholder="Enter your text content here..."
                    className="text-input"
                    rows={4}
                  />
              </div>
              </div>
              </div>

            {/* Platform Container */}
            <div className={`input-container ${fieldErrors.platform || fieldErrors.contentType || fieldErrors.layout ? 'error' : ''}`}>
              <h3>{t('socialMediaPlatform')}</h3>
              <div className="platform-options">
                <div
                  className={`platform-option ${selectedPlatform === 'instagram' ? 'selected' : ''}`}
                  onClick={() => handlePlatformChange('instagram')}
                  title="Instagram"
                >
                  <div className="platform-icon instagram-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <defs>
                        <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f09433"/>
                          <stop offset="25%" stopColor="#e6683c"/>
                          <stop offset="50%" stopColor="#dc2743"/>
                          <stop offset="75%" stopColor="#cc2366"/>
                          <stop offset="100%" stopColor="#bc1888"/>
                        </linearGradient>
                      </defs>
                      <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
          </div>
                  <span>{t('instagram')}</span>
                  
                  {/* Instagram Content Type Options */}
                  {selectedPlatform === 'instagram' && (
                    <div className="platform-content-options">
                      <h5>{t('contentType')}</h5>
                      <div className="content-type-options">
                        <div
                          className={`content-type-option ${contentType === 'post' ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContentTypeChange('post');
                          }}
                          title={t('post')}
                        >
                          <div className="content-type-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                          </div>
                          <span>{t('post')}</span>
                        </div>
                        <div
                          className={`content-type-option ${contentType === 'story' ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContentTypeChange('story');
                          }}
                          title={t('story')}
                        >
                          <div className="content-type-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M8 12l2 2 4-4"/>
                            </svg>
                          </div>
                          <span>{t('story')}</span>
                        </div>
                      </div>
                      
                      {/* Instagram Layout Options - Show after content type is selected */}
                      {contentType && (
                        <div className="platform-layout-options">
                          <h6>{t('layoutOptions')}</h6>
                          <div className="layout-options">
                            {getLayoutOptions().map(layout => (
                              <div
                                key={layout}
                                className={`layout-option ${selectedLayout === layout ? 'selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (selectedLayout === layout) {
                                    setSelectedLayout('');
                                  } else {
                                    setSelectedLayout(layout);
                                  }
                                  // Clear layout error when changed
                                  setFieldErrors(prev => ({ ...prev, layout: false }));
                                  checkAndClearError();
                                }}
                                title={layout}
                              >
                                <div className="layout-icon">
                                  {layout === t('square') && (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    </svg>
                                  )}
                                  {layout === t('portrait') && (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
                                    </svg>
                                  )}
                                  {layout === t('landscape') && (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
                                    </svg>
                                  )}
                                </div>
                                <span>{layout}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div
                  className={`platform-option ${selectedPlatform === 'facebook' ? 'selected' : ''}`}
                  onClick={() => handlePlatformChange('facebook')}
                  title="Facebook"
                >
                  <div className="platform-icon facebook-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                              </div>
                  <span>{t('facebook')}</span>
                  
                  {/* Facebook Content Type Options */}
                  {selectedPlatform === 'facebook' && (
                    <div className="platform-content-options">
                      <h5>{t('contentType')}</h5>
                      <div className="content-type-options">
                        <div
                          className={`content-type-option ${contentType === 'post' ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContentTypeChange('post');
                          }}
                          title={t('post')}
                        >
                          <div className="content-type-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                          </div>
                          <span>{t('post')}</span>
                        </div>
                        <div
                          className={`content-type-option ${contentType === 'story' ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContentTypeChange('story');
                          }}
                          title={t('story')}
                        >
                          <div className="content-type-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M8 12l2 2 4-4"/>
                            </svg>
                          </div>
                          <span>{t('story')}</span>
                        </div>
                      </div>
                      
                      {/* Facebook Layout Options - Show after content type is selected */}
                      {contentType && (
                        <div className="platform-layout-options">
                          <h6>{t('layoutOptions')}</h6>
                          <div className="layout-options">
                            {getLayoutOptions().map(layout => (
                              <div
                                key={layout}
                                className={`layout-option ${selectedLayout === layout ? 'selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (selectedLayout === layout) {
                                    setSelectedLayout('');
                                  } else {
                                    setSelectedLayout(layout);
                                  }
                                  // Clear layout error when changed
                                  setFieldErrors(prev => ({ ...prev, layout: false }));
                                  checkAndClearError();
                                }}
                                title={layout}
                              >
                                <div className="layout-icon">
                                  {layout === t('square') && (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    </svg>
                                  )}
                                  {layout === t('portrait') && (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
                                    </svg>
                                  )}
                                  {layout === t('landscape') && (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
                                    </svg>
                                  )}
                                </div>
                                <span>{layout}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div
                  className={`platform-option ${selectedPlatform === 'linkedin' ? 'selected' : ''}`}
                  onClick={() => handlePlatformChange('linkedin')}
                  title="LinkedIn"
                >
                  <div className="platform-icon linkedin-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
              </div>
                  <span>{t('linkedin')}</span>
                  
                  {/* LinkedIn Content Type Options */}
                  {selectedPlatform === 'linkedin' && (
                    <div className="platform-content-options">
                      <h5>{t('contentType')}</h5>
                      <div className="content-type-options">
                        <div
                          className={`content-type-option ${contentType === 'post' ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContentTypeChange('post');
                          }}
                          title={t('post')}
                        >
                          <div className="content-type-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                            </svg>
                          </div>
                          <span>{t('post')}</span>
                        </div>
                      </div>
                      
                      {/* LinkedIn Layout Options - Show after content type is selected */}
                      {contentType && (
                        <div className="platform-layout-options">
                          <h6>{t('layoutOptions')}</h6>
                          <div className="layout-options">
                            {getLayoutOptions().map(layout => (
                              <div
                                key={layout}
                                className={`layout-option ${selectedLayout === layout ? 'selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (selectedLayout === layout) {
                                    setSelectedLayout('');
                                  } else {
                                    setSelectedLayout(layout);
                                  }
                                  // Clear layout error when changed
                                  setFieldErrors(prev => ({ ...prev, layout: false }));
                                  checkAndClearError();
                                }}
                                title={layout}
                              >
                                <div className="layout-icon">
                                  {layout === t('square') && (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                    </svg>
                                  )}
                                  {layout === t('portrait') && (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <rect x="5" y="3" width="14" height="18" rx="2" ry="2"/>
                                    </svg>
                                  )}
                                  {layout === t('landscape') && (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                      <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
                                    </svg>
                                  )}
                                </div>
                                <span>{layout}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Text Length Options - Only for Posts */}
              {contentType === 'post' && (
                <div className="text-length-section">
                  <h4>{t('textLength')}</h4>
                  <div className="text-length-options">
                    {[
                      { value: 'short', label: t('short') },
                      { value: 'medium', label: t('medium') },
                      { value: 'long', label: t('long') }
                    ].map(length => (
                      <div
                        key={length.value}
                        className={`text-length-option ${selectedTextLength === length.value ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTextLengthChange(length.value);
                        }}
                        title={length.label}
                      >
                        <div className="text-length-icon">
                          {length.value === 'short' && (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/>
                            </svg>
                          )}
                          {length.value === 'medium' && (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 7h18v2H3V7zm0 4h12v2H3v-2zm0 4h8v2H3v-2z"/>
                            </svg>
                          )}
                          {length.value === 'long' && (
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/>
                            </svg>
                          )}
                        </div>
                        <span>{length.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Output Type Container */}
            <div className={`input-container ${fieldErrors.outputType ? 'error' : ''}`}>
              <h3>{t('outputType')}</h3>
              <div className="output-type-options">
                <div
                  className={`output-type-option ${outputType === 'static' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (outputType === 'static') {
                      setOutputType(''); // Unselect if clicking the same option
                    } else {
                      setOutputType('static'); // Select the new option
                    }
                    // Clear outputType error when changed
                    setFieldErrors(prev => ({ ...prev, outputType: false }));
                    checkAndClearError();
                  }}
                  title={t('staticOutput')}
                >
                  <div className="output-type-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7v6l5-3z"/>
                    </svg>
                  </div>
                  <span>{t('staticOutput')}</span>
                </div>
                <div
                  className={`output-type-option ${outputType === 'animated' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (outputType === 'animated') {
                      setOutputType(''); // Unselect if clicking the same option
                    } else {
                      setOutputType('animated'); // Select the new option
                    }
                    // Clear outputType error when changed
                    setFieldErrors(prev => ({ ...prev, outputType: false }));
                    checkAndClearError();
                  }}
                  title={t('animatedOutput')}
                >
                  <div className="output-type-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <span>{t('animatedOutput')}</span>
                </div>
              </div>
            </div>

            {/* Category Container */}
            <div className={`input-container ${fieldErrors.category ? 'error' : ''}`}>
              <h3>{t('category')}</h3>
              <div className="banner-options">
                <div className="banner-toggle">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={addBanner}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setAddBanner(isChecked);
                        if (!isChecked) {
                          setBannerName(''); // Clear category name when unchecked
                          setFieldErrors(prev => ({ ...prev, category: false }));
                        }
                        checkAndClearError();
                      }}
                    />
                    <span className="checkmark"></span>
                    {t('addCategory')}
                  </label>
                </div>
                
                {addBanner && (
                  <div className="banner-input-section">
                    <label htmlFor="banner-name">{t('categoryText')}</label>
                    <input
                      id="banner-name"
                      type="text"
                      value={bannerName}
                      onChange={(e) => {
                        setBannerName(e.target.value);
                        // Clear category error when text is entered
                        setFieldErrors(prev => ({ ...prev, category: false }));
                        checkAndClearError();
                      }}
                      onFocus={() => setShowCategorySuggestions(true)}
                      onBlur={() => {
                        // Delay hiding to allow clicking on suggestions
                        setTimeout(() => setShowCategorySuggestions(false), 200);
                      }}
                      className="banner-input"
                    />
                    {showCategorySuggestions && categorySuggestions.length > 0 && (
                      <div className="category-suggestions">
                        <div className="category-suggestions-label">Suggestions:</div>
                        <div className="category-suggestions-list">
                          {categorySuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              className="category-suggestion-chip"
                              onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input blur
                                setBannerName(suggestion);
                                setFieldErrors(prev => ({ ...prev, category: false }));
                                setShowCategorySuggestions(false);
                                checkAndClearError();
                              }}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Newspaper Container */}
            <div className={`input-container ${fieldErrors.newspaper ? 'error' : ''}`}>
              <h3>{t('newspaper')}</h3>
              <div className="newspaper-options">
                <div
                  className={`newspaper-option kaleva ${selectedNewspaper === 'Kaleva' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewspaperChange('Kaleva');
                  }}
                  title="Kaleva"
                >
                  <div className="newspaper-logo">
                    <img src={kalevaLogo} alt="Kaleva" />
                  </div>
                </div>
                
                <div
                  className={`newspaper-option lapin-kansa ${selectedNewspaper === 'Lapin Kansa' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewspaperChange('Lapin Kansa');
                  }}
                  title="Lapin Kansa"
                >
                  <div className="newspaper-logo">
                    <img src={lapinKansaLogo} alt="Lapin Kansa" />
                  </div>
                </div>
                
                <div
                  className={`newspaper-option ilkka-pohjalainen ${selectedNewspaper === 'Ilkka-Pohjalainen' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewspaperChange('Ilkka-Pohjalainen');
                  }}
                  title="Ilkka-Pohjalainen"
                >
                  <div className="newspaper-logo">
                    <img src={ilkkaPohjalainenLogo} alt="Ilkka-Pohjalainen" />
                  </div>
                </div>
                
                <div
                  className={`newspaper-option koillissanomat ${selectedNewspaper === 'Koillissanomat' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewspaperChange('Koillissanomat');
                  }}
                  title="Koillissanomat"
                >
                  <div className="newspaper-logo">
                    <img src={koillissanomatLogo} alt="Koillissanomat" />
                  </div>
                </div>
                
                <div
                  className={`newspaper-option rantalakeus ${selectedNewspaper === 'Rantalakeus' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewspaperChange('Rantalakeus');
                  }}
                  title="Rantalakeus"
                >
                  <div className="newspaper-logo">
                    <img src={rantalakeusLogo} alt="Rantalakeus" />
                  </div>
                </div>
                
                <div
                  className={`newspaper-option iijokiseutu ${selectedNewspaper === 'Iijokiseutu' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewspaperChange('Iijokiseutu');
                  }}
                  title="Iijokiseutu"
                >
                  <div className="newspaper-logo">
                    <img src={iijokiseutuLogo} alt="Iijokiseutu" />
                  </div>
                </div>
                
                <div
                  className={`newspaper-option raahen-seutu ${selectedNewspaper === 'Raahen Seutu' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewspaperChange('Raahen Seutu');
                  }}
                  title="Raahen Seutu"
                >
                  <div className="newspaper-logo">
                    <img src={raahenSeutuLogo} alt="Raahen Seutu" />
                  </div>
                </div>
                
                <div
                  className={`newspaper-option pyhajokiseutu ${selectedNewspaper === 'Pyhäjokiseutu' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewspaperChange('Pyhäjokiseutu');
                  }}
                  title="Pyhäjokiseutu"
                >
                  <div className="newspaper-logo">
                    <img src={pyhajokiseutuLogo} alt="Pyhäjokiseutu" />
                  </div>
                </div>
                
                <div
                  className={`newspaper-option siikajokilaakso ${selectedNewspaper === 'Siikajokilaakso' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewspaperChange('Siikajokilaakso');
                  }}
                  title="Siikajokilaakso"
                >
                  <div className="newspaper-logo">
                    <img src={siikajokilaaksoLogo} alt="Siikajokilaakso" />
                  </div>
                </div>
              </div>
            </div>

            {/* Process Button */}
            <div className="process-container">
              {backendStatus === 'disconnected' && (
                <div className="warning-message">
                  ⚠️ {t('backendDisconnected')}
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  ❌ {error}
                </div>
              )}
              
              <button 
                className="process-button"
                onClick={handleGenerateClick}
                disabled={
                  processingStatus === 'processing' ||
                  backendStatus === 'disconnected'
                }
              >
                {t('generateContent')}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - OUTPUTS */}
          <div className="output-panel">
            <h2>{t('generatedOutput')}</h2>
            
            {processedContent ? (
              <div className="output-content">
                {/* Text Output Container */}
                <div className="input-container">
                  <h3>{t('textOutput')}</h3>
                  
                  {/* Generated Text Versions */}
                  {processedContent.headings && processedContent.descriptions ? (
                    <div className="text-versions-container">
                      {processedContent.headings.map((heading, index) => (
                        <div key={index} className="text-version-item">
                          <h4>Version {index + 1}</h4>
                          
                          {/* Generated Heading */}
                          <div className="heading-output">
                            <h5>Heading:</h5>
                            <p className="generated-heading">
                              {heading || 'No heading generated'}
                            </p>
                          </div>
                          
                          {/* Generated Description */}
                          <div className="description-output">
                            <h5>Description:</h5>
                            <p>
                              {processedContent.descriptions[index] || t('noDescription')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Fallback for single version */
                    <>
                      <div className="heading-output">
                        <h4>Heading:</h4>
                        <p className="generated-heading">
                          {processedContent.heading || 'No heading generated'}
                        </p>
                      </div>
                      
                      <div className="description-output">
                        <h4>Description:</h4>
                        <p>
                          {processedContent.description || t('noDescription')}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Graphic Output Container */}
                <div className="input-container">
                  <h3>{t('graphicOutput')}</h3>
                  
                  {processedContent.graphicUrls && processedContent.graphicUrls.length > 0 ? (
                    <div className="graphic-output">
                      <div className="multiple-graphics-container">
                        <h4>Generated Graphics ({processedContent.graphicUrls.length} versions)</h4>
                        <div className="graphics-grid">
                          {processedContent.graphicUrls.map((graphicUrl, index) => (
                            <div key={index} className="graphic-version">
                              <h5>Version {index + 1}</h5>
                              {processedContent.outputType === 'static' ? (
                                <div className="static-graphic-preview">
                                  <div className="graphic-preview-container">
                                    <img 
                                      src={getDownloadUrl(graphicUrl.split('/').pop())}
                                      alt={`Generated branded graphic version ${index + 1}`}
                                      className="generated-graphic-image"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                      }}
                                    />
                                    <div className="graphic-placeholder" style={{display: 'none'}}>
                                      <div className="graphic-icon">🖼️</div>
                                      <p>Static Branded Graphic</p>
                                      <small>
                                        {processedContent.platform} {processedContent.contentType} - {processedContent.layout}
                                      </small>
                                      <small className="dimensions">{processedContent.dimensions}</small>
                                      <button className="download-btn" onClick={() => handleDownload(graphicUrl)}>
                                        Download Version {index + 1}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="graphic-info">
                                    <small>
                                      {processedContent.platform} {processedContent.contentType} - {processedContent.layout}
                                    </small>
                                    <small className="dimensions">{processedContent.dimensions}</small>
                                    <button className="download-btn" onClick={() => handleDownload(graphicUrl)}>
                                      Download Version {index + 1}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="animated-graphic-preview">
                                  <div className="graphic-preview-container">
                                    <video 
                                      src={getDownloadUrl(graphicUrl.split('/').pop())}
                                      className="generated-graphic-video"
                                      controls
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                      }}
                                    >
                                      Your browser does not support the video tag.
                                    </video>
                                    <div className="graphic-placeholder" style={{display: 'none'}}>
                                      <div className="graphic-icon">🎬</div>
                                      <p>Animated Branded Graphic</p>
                                      <small>
                                        {processedContent.platform} {processedContent.contentType} - {processedContent.layout}
                                      </small>
                                      <small className="dimensions">{processedContent.dimensions}</small>
                                      <button className="download-btn" onClick={() => handleDownload(graphicUrl)}>
                                        Download Version {index + 1}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="graphic-info">
                                    <small>
                                      {processedContent.platform} {processedContent.contentType} - {processedContent.layout}
                                    </small>
                                    <small className="dimensions">{processedContent.dimensions}</small>
                                    <button className="download-btn" onClick={() => handleDownload(graphicUrl)}>
                                      Download Version {index + 1}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : processedContent.graphicUrl ? (
                    <div className="graphic-output">
                      <p>Single graphic generated successfully!</p>
                      <button className="download-btn" onClick={handleDownload}>
                        Download Graphic
                      </button>
                    </div>
                  ) : (
                    <div className="graphic-output">
                      <p>Graphic generation in progress or no image provided...</p>
                    </div>
                  )}
                  
                  {/* Task Info */}
                  <div className="task-info">
                    <small>Task ID: {processedContent.taskId}</small>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-output">
                <div className="no-output-icon">📝</div>
                <p>{t('configureInputs')}</p>
            </div>
            )}
          </div>
            </div>
      </main>

      <footer className="app-footer">
        <p>{t('footer')}</p>
      </footer>
    </div>
  );
}

// Main App Component with Language Provider
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
