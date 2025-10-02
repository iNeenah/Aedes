// Server actions for reports management
import { supabase, TABLES, BUCKETS } from '../lib/supabase.js';

/**
 * Upload image to Supabase Storage
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export const uploadImageToStorage = async (file) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Please check environment variables.');
  }

  try {
    const fileName = `public/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKETS.REPORTS)
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from(BUCKETS.REPORTS)
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

/**
 * Create a new report in the database
 * @param {Object} reportData - Report data to insert
 * @returns {Promise<Object>} - Created report data
 */
export const createReport = async (reportData) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Please check environment variables.');
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.REPORTS)
      .insert(reportData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating report: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Create report error:', error);
    throw error;
  }
};

/**
 * Fetch all reports from the database
 * @returns {Promise<Array>} - Array of reports
 */
export const fetchReports = async () => {
  if (!supabase) {
    console.warn('Supabase not configured. Returning empty array.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.REPORTS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching reports: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Fetch reports error:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time changes in reports
 * @param {Function} callback - Callback function to handle new reports
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToReports = (callback) => {
  if (!supabase) {
    console.warn('Supabase not configured. Real-time updates disabled.');
    return () => {}; // Return empty unsubscribe function
  }

  const channel = supabase
    .channel('public:reports')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: TABLES.REPORTS },
      (payload) => {
        console.log('New report received:', payload.new);
        callback(payload.new);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Get criticality weight based on level
 * @param {string} level - Criticality level (BAJA, MEDIA, ALTA, CRITICA)
 * @returns {number} - Weight value
 */
export const getCriticalityWeight = (level) => {
  switch (level) {
    case 'BAJA':
      return 0.3;
    case 'MEDIA':
      return 0.6;
    case 'ALTA':
      return 0.9;
    case 'CRITICA':
      return 1.0;
    default:
      return 0.3;
  }
};