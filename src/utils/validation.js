// Validation utilities - Client-side helpers
import { APP_CONFIG } from '../constants/config';

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {Object} - Validation result
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File must be an image' };
  }

  if (file.size > APP_CONFIG.maxImageSize) {
    return { 
      isValid: false, 
      error: `Image must be less than ${APP_CONFIG.maxImageSize / (1024 * 1024)}MB` 
    };
  }

  return { isValid: true };
};

/**
 * Validate coordinates
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Object} - Validation result
 */
export const validateCoordinates = (latitude, longitude) => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return { isValid: false, error: 'Coordinates must be numbers' };
  }

  if (latitude < -90 || latitude > 90) {
    return { isValid: false, error: 'Latitude must be between -90 and 90' };
  }

  if (longitude < -180 || longitude > 180) {
    return { isValid: false, error: 'Longitude must be between -180 and 180' };
  }

  return { isValid: true };
};

/**
 * Validate report form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result
 */
export const validateReportForm = (formData) => {
  const errors = [];

  if (!formData.selectedImage) {
    errors.push('Photo is required');
  }

  if (!formData.selectedZone) {
    errors.push('Zone selection is required');
  }

  if (!formData.streetAddress?.trim()) {
    errors.push('Street address is required');
  }

  if (!formData.criticality) {
    errors.push('Criticality level is required');
  }

  if (formData.selectedZone === '99' && !formData.selectedLocation) {
    errors.push('Map location is required when "Others" is selected');
  }

  if (formData.selectedLocation) {
    const coordValidation = validateCoordinates(
      formData.selectedLocation.latitude,
      formData.selectedLocation.longitude
    );
    if (!coordValidation.isValid) {
      errors.push(coordValidation.error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize text input
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
};