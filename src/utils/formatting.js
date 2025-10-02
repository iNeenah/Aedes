// Formatting utilities - Client-side helpers
import { CRITICALITY_LEVELS } from '../constants/config';

/**
 * Format date for display
 * @param {string|Date} dateString - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format coordinates for display
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {string} - Formatted coordinates
 */
export const formatCoordinates = (latitude, longitude) => {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

/**
 * Get criticality display properties
 * @param {string} level - Criticality level
 * @returns {Object} - Display properties
 */
export const getCriticalityDisplay = (level) => {
  const config = CRITICALITY_LEVELS[level] || CRITICALITY_LEVELS.BAJA;
  return {
    ...config,
    className: `text-${config.color}-600`
  };
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Build comprehensive description for report
 * @param {Object} formData - Form data
 * @param {Object} zoneData - Selected zone data
 * @param {Object} location - Location data
 * @returns {string} - Comprehensive description
 */
export const buildReportDescription = (formData, zoneData, location) => {
  let description = `${formData.streetAddress.trim()} - ${zoneData.name}`;
  
  if (formData.criaderoType) {
    description += ` | Tipo: ${formData.criaderoType}`;
  }
  
  if (formData.proximity) {
    description += ` | Cerca de: ${formData.proximity}`;
  }
  
  if (formData.accessInfo) {
    description += ` | Acceso: ${formData.accessInfo}`;
  }
  
  if (formData.description?.trim()) {
    description += ` | Obs: ${formData.description.trim()}`;
  }
  
  if (location?.adjusted) {
    description += ` | Ubicación ajustada por IA (${Math.round(location.confidence * 100)}% confianza)`;
  }
  
  return description;
};