/**
 * API service for backend communication
 */
import { API_ENDPOINTS } from '../config';

/**
 * Check backend health status
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.health);
    if (!response.ok) {
      throw new Error('Backend health check failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

/**
 * Generate branded content
 */
export const generateContent = async (formData) => {
  try {
    const response = await fetch(API_ENDPOINTS.generate, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Content generation error:', error);
    throw error;
  }
};

/**
 * Get download URL for a file
 */
export const getDownloadUrl = (filename) => {
  return `${API_ENDPOINTS.download}/${filename}`;
};

/**
 * Get list of available newspapers
 */
export const getNewspapers = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.newspapers);
    if (!response.ok) {
      throw new Error('Failed to fetch newspapers');
    }
    return await response.json();
  } catch (error) {
    console.error('Newspapers fetch error:', error);
    throw error;
  }
};



