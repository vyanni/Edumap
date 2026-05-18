/**
 * API Configuration
 * Uses environment variable or falls back to local development
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default API_BASE_URL;
