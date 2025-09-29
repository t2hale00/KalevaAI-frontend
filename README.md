# KalevaAI Frontend

## Overview
Modern React-based user interface for KalevaAI - the AI-assisted social media content application. This frontend provides an intuitive interface for uploading, processing, and downloading social media content adapted for LinkedIn, Instagram, and Facebook.

## Features Implemented

### ✅ Core Requirements (from Requirements Specification)

1. **File Upload Interface** (IMG-001, VID-001)
   - Drag-and-drop file upload
   - Support for images (JPEG, PNG, WebP) and videos (MP4, MOV, AVI)
   - Multiple file selection
   - File preview and management

2. **Preview Functionality** (UI-002)
   - Real-time preview of processed content
   - Platform-specific dimension display
   - Before/after comparison

3. **Batch Processing Interface** (UI-003)
   - Process multiple files simultaneously
   - Progress indicators
   - Status tracking

4. **Export/Download Options** (UI-004)
   - Individual file downloads
   - Bulk download functionality
   - Organized folder structure

### 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient backgrounds
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Platform Selection**: Visual platform cards with specifications
- **Real-time Feedback**: Processing status and progress indicators
- **Accessibility**: Keyboard navigation and screen reader support

### 📱 Platform-Specific Adaptations

#### LinkedIn
- Professional tone and styling
- 1200x627px image dimensions
- Business-focused content preview

#### Instagram
- Visual storytelling emphasis
- 1080x1080px square format
- Engaging, aesthetic presentation

#### Facebook
- Community engagement focus
- 1200x630px image dimensions
- Conversational tone

## Technical Implementation

### React Components
- **App.js**: Main application component with state management
- **File Upload**: React Dropzone integration for drag-and-drop
- **Platform Selection**: Checkbox-based platform selection
- **Processing Pipeline**: Simulated AI processing workflow
- **Results Display**: Organized content preview and download

### Styling
- **CSS Modules**: Scoped styling for components
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Gradient backgrounds, shadows, and animations
- **Accessibility**: High contrast ratios and focus states

### State Management
- **useState**: Local state for file management and processing
- **useCallback**: Optimized event handlers
- **File Management**: Preview URLs and metadata tracking

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development
```bash
npm start
```
Runs the app in development mode at http://localhost:3000

### Build
```bash
npm run build
```
Builds the app for production to the `build` folder.

## File Structure
```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Main stylesheet
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
└── package.json        # Dependencies and scripts
```

## Integration Points

### Backend API Integration
The frontend is designed to integrate with the FastAPI backend:

```javascript
// Example API integration points
const processFiles = async (files, platforms) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('platforms', JSON.stringify(platforms));
  
  const response = await fetch('/api/process', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

### Expected API Endpoints
- `POST /api/upload` - File upload endpoint
- `POST /api/process` - Content processing endpoint
- `GET /api/download/{file_id}` - File download endpoint
- `POST /api/generate-captions` - Text generation endpoint

## Future Enhancements

### Phase 2 Features
- **User Authentication**: Login/logout functionality
- **Processing History**: Track previous processing jobs
- **Template Library**: Save and reuse content templates
- **Advanced Settings**: Custom processing parameters

### Phase 3 Features
- **Real-time Collaboration**: Multiple users working together
- **Content Analytics**: Processing statistics and insights
- **API Integration**: Direct social media platform posting
- **Mobile App**: React Native mobile application

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Load components on demand
- **Image Optimization**: Compress and resize images
- **Caching**: Cache processed results
- **Progressive Loading**: Show partial results as they complete

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Considerations

### Data Privacy
- **No Permanent Storage**: Files processed and immediately deleted
- **Client-side Processing**: Sensitive operations on user device
- **Secure Uploads**: File type validation and size limits
- **HTTPS Only**: All communications encrypted

### File Validation
- **Type Checking**: Validate file MIME types
- **Size Limits**: Enforce maximum file sizes
- **Virus Scanning**: Scan uploaded files (backend)
- **Content Filtering**: Detect inappropriate content

## Testing Strategy

### Unit Tests
- Component rendering tests
- State management tests
- Event handler tests

### Integration Tests
- File upload workflow
- Processing pipeline
- Download functionality

### E2E Tests
- Complete user journey
- Cross-browser compatibility
- Mobile responsiveness

## Deployment

### Production Build
```bash
npm run build
```

### Static Hosting
- **Netlify**: Easy deployment with continuous integration
- **Vercel**: Optimized for React applications
- **AWS S3**: Scalable static hosting
- **GitHub Pages**: Free hosting for open source projects

### Environment Variables
```bash
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_MAX_FILE_SIZE=50000000
REACT_APP_SUPPORTED_FORMATS=image/*,video/*
```

## Contributing

### Development Guidelines
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write comprehensive tests
- Document all components

### Code Style
- ESLint configuration for consistent code
- Prettier for code formatting
- Conventional commits for version control
- Component documentation with JSDoc

---

*This frontend provides a solid foundation for the AI Social Media Content Assistant application, implementing all core requirements from the specification document while maintaining modern web development best practices.*
