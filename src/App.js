import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [textContent, setTextContent] = useState('');
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [processedContent, setProcessedContent] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    linkedin: true,
    instagram: true,
    facebook: true
  });

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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    multiple: true
  });

  const handleProcessFiles = async () => {
    setProcessingStatus('processing');
    
    // Simulate API call
    setTimeout(() => {
      setProcessedContent({
        images: uploadedFiles.filter(f => f.type.startsWith('image/')),
        videos: uploadedFiles.filter(f => f.type.startsWith('video/')),
        textContent: textContent,
        platforms: selectedPlatforms
      });
      setProcessingStatus('completed');
    }, 3000);
  };

  const handleDownload = (platform, contentType) => {
    // Simulate download functionality
    console.log(`Downloading ${contentType} for ${platform}`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>KalevaAI</h1>
        <p>AI-powered social media content adaptation for LinkedIn, Instagram, and Facebook</p>
      </header>

      <main className="app-main">
        {/* Input Section - Side by Side */}
        <section className="input-section">
          <div className="input-grid">
            {/* Text Input - Left Side */}
            <div className="text-input-container">
              <h2>📝 Enter Your Text Content</h2>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter your text content here... This could be a blog post, article, announcement, or any text you want to adapt for social media platforms."
                className="text-input"
                rows={6}
              />
              <div className="text-input-info">
                <small>AI will create platform-specific versions of your text</small>
              </div>
            </div>

            {/* File Upload - Right Side */}
            <div className="upload-container">
              <h2>📁 Upload Media (Optional)</h2>
              <div 
                {...getRootProps()} 
                className={`dropzone ${isDragActive ? 'active' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="dropzone-content">
                  <div className="upload-icon">📁</div>
                  <p>
                    {isDragActive 
                      ? 'Drop your files here...' 
                      : 'Drag & drop files here, or click to select'
                    }
                  </p>
                  <small>Supports images (JPEG, PNG, WebP) and videos (MP4, MOV, AVI)</small>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                  <h3>Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="files-grid">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="file-item">
                        <div className="file-preview">
                          {file.type.startsWith('image/') ? (
                            <img src={file.preview} alt={file.name} />
                          ) : (
                            <div className="video-preview">
                              <div className="video-icon">🎥</div>
                              <span>{file.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <button 
                          className="remove-file"
                          onClick={() => setUploadedFiles(prev => 
                            prev.filter(f => f.id !== file.id)
                          )}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Platform Selection */}
        <section className="platform-selection">
          <h2>🎯 Select Target Platforms</h2>
          <div className="platforms-grid">
            <label className="platform-option">
              <input
                type="checkbox"
                checked={selectedPlatforms.linkedin}
                onChange={(e) => setSelectedPlatforms(prev => ({
                  ...prev,
                  linkedin: e.target.checked
                }))}
              />
              <div className="platform-card">
                <div className="platform-icon">💼</div>
                <h3>LinkedIn</h3>
                <p>Professional content</p>
                <small>1200x627px images</small>
              </div>
            </label>

            <label className="platform-option">
              <input
                type="checkbox"
                checked={selectedPlatforms.instagram}
                onChange={(e) => setSelectedPlatforms(prev => ({
                  ...prev,
                  instagram: e.target.checked
                }))}
              />
              <div className="platform-card">
                <div className="platform-icon">📸</div>
                <h3>Instagram</h3>
                <p>Visual storytelling</p>
                <small>1080x1080px images</small>
              </div>
            </label>

            <label className="platform-option">
              <input
                type="checkbox"
                checked={selectedPlatforms.facebook}
                onChange={(e) => setSelectedPlatforms(prev => ({
                  ...prev,
                  facebook: e.target.checked
                }))}
              />
              <div className="platform-card">
                <div className="platform-icon">👥</div>
                <h3>Facebook</h3>
                <p>Community engagement</p>
                <small>1200x630px images</small>
              </div>
            </label>
          </div>
        </section>

        {/* Processing Section */}
        <section className="processing-section">
          <button 
            className="process-button"
            onClick={handleProcessFiles}
            disabled={(uploadedFiles.length === 0 && textContent.trim() === '') || processingStatus === 'processing'}
          >
            {processingStatus === 'processing' ? (
              <>
                <div className="spinner"></div>
                Processing...
              </>
            ) : (
              '🚀 Process Content'
            )}
          </button>
        </section>

        {/* Results Section */}
        {processedContent && (
          <section className="results-section">
            <h2>✨ Processed Content</h2>
            
            {/* Images */}
            {processedContent.images.length > 0 && (
              <div className="content-group">
                <h3>Images</h3>
                <div className="platform-results">
                  {Object.entries(processedContent.platforms)
                    .filter(([_, selected]) => selected)
                    .map(([platform, _]) => (
                      <div key={platform} className="platform-result">
                        <h4>{platform.charAt(0).toUpperCase() + platform.slice(1)}</h4>
                        <div className="processed-images">
                          {processedContent.images.map((file, index) => (
                            <div key={index} className="processed-item">
                              <img 
                                src={file.preview} 
                                alt={`${platform} version`}
                                className="processed-image"
                              />
                              <div className="image-info">
                                <span className="dimensions">
                                  {platform === 'linkedin' ? '1200x627' : 
                                   platform === 'instagram' ? '1080x1080' : '1200x630'}
                                </span>
                                <button 
                                  className="download-btn"
                                  onClick={() => handleDownload(platform, 'image')}
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {processedContent.videos.length > 0 && (
              <div className="content-group">
                <h3>Videos</h3>
                <div className="platform-results">
                  {Object.entries(processedContent.platforms)
                    .filter(([_, selected]) => selected)
                    .map(([platform, _]) => (
                      <div key={platform} className="platform-result">
                        <h4>{platform.charAt(0).toUpperCase() + platform.slice(1)}</h4>
                        <div className="processed-videos">
                          {processedContent.videos.map((file, index) => (
                            <div key={index} className="processed-item">
                              <div className="video-preview-large">
                                <div className="video-icon">🎥</div>
                                <span>{file.name}</span>
                              </div>
                              <div className="video-info">
                                <span className="format">MP4</span>
                                <button 
                                  className="download-btn"
                                  onClick={() => handleDownload(platform, 'video')}
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Generated Text Content */}
            {processedContent.textContent && (
              <div className="content-group">
                <h3>Generated Text Content</h3>
                <div className="text-results-section">
                  {Object.entries(processedContent.platforms)
                    .filter(([_, selected]) => selected)
                    .map(([platform, _]) => (
                      <div key={platform} className="platform-text-content">
                        <h4>{platform.charAt(0).toUpperCase() + platform.slice(1)} Version</h4>
                        <div className="text-options">
                          {[1, 2, 3].map(num => (
                            <div key={num} className="text-option">
                              <div className="text-content">
                                <h5>Version {num}</h5>
                                <p className="text-version">
                                  {platform === 'linkedin' 
                                    ? `Professional LinkedIn post ${num}: Transform your original text into a business-focused, professional format with industry insights and relevant hashtags. Perfect for B2B engagement and thought leadership.`
                                    : platform === 'instagram'
                                    ? `Engaging Instagram post ${num}: Convert your text into a visually appealing, story-driven format with emojis, line breaks, and Instagram-specific hashtags. Designed for maximum engagement and visual storytelling.`
                                    : `Conversational Facebook post ${num}: Adapt your content for Facebook's community-focused environment with conversational tone, questions to encourage interaction, and Facebook-optimized hashtags.`
                                  }
                                </p>
                              </div>
                              <div className="text-actions">
                                <button className="copy-btn">Copy</button>
                                <button className="edit-btn">Edit</button>
                                <button className="download-btn">Download</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Generated Captions for Media */}
            {(processedContent.images.length > 0 || processedContent.videos.length > 0) && (
              <div className="content-group">
                <h3>Generated Media Captions</h3>
                <div className="captions-section">
                  {Object.entries(processedContent.platforms)
                    .filter(([_, selected]) => selected)
                    .map(([platform, _]) => (
                      <div key={platform} className="platform-captions">
                        <h4>{platform.charAt(0).toUpperCase() + platform.slice(1)} Captions</h4>
                        <div className="caption-options">
                          {[1, 2, 3].map(num => (
                            <div key={num} className="caption-option">
                              <p className="caption-text">
                                {platform === 'linkedin' 
                                  ? `Professional caption ${num} for LinkedIn with relevant hashtags and business focus.`
                                  : platform === 'instagram'
                                  ? `Engaging Instagram caption ${num} with emojis and visual storytelling elements.`
                                  : `Conversational Facebook caption ${num} for community engagement and social interaction.`
                                }
                              </p>
                              <div className="caption-actions">
                                <button className="copy-btn">Copy</button>
                                <button className="edit-btn">Edit</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Download All */}
            <div className="download-all-section">
              <button className="download-all-btn">
                📦 Download All Content
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>KalevaAI - Powered by OpenCV & LLM</p>
      </footer>
    </div>
  );
}

export default App;
