/**
 * Frontend configuration
 */

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  generate: `${API_BASE_URL}/api/generate`,
  download: `${API_BASE_URL}/api/download`,
  newspapers: `${API_BASE_URL}/api/newspapers`,
};




