const http = require('http');

/**
 * Setup custom HTTP status codes for the voting system
 */
function setupCustomStatusCodes() {
  // Custom status codes for voting system (218-240)
  http.STATUS_CODES[218] = 'Created';
  http.STATUS_CODES[222] = 'Found';
  http.STATUS_CODES[223] = 'Listed';
  http.STATUS_CODES[224] = 'Updated';
  http.STATUS_CODES[225] = 'Deleted';
  http.STATUS_CODES[226] = 'Registered';
  http.STATUS_CODES[227] = 'Listed';
  http.STATUS_CODES[228] = 'Vote Cast';
  http.STATUS_CODES[229] = 'Votes Retrieved';
  http.STATUS_CODES[230] = 'Filtered';
  http.STATUS_CODES[231] = 'Results';
  http.STATUS_CODES[233] = 'Timeline';
  http.STATUS_CODES[234] = 'Weighted';
  http.STATUS_CODES[235] = 'Range';
  http.STATUS_CODES[236] = 'Encrypted';
  http.STATUS_CODES[237] = 'Tallied';
  http.STATUS_CODES[238] = 'Private';
  http.STATUS_CODES[239] = 'Ranked';
  http.STATUS_CODES[240] = 'Audited';
}

/**
 * Get status message for custom codes
 */
function getStatusMessage(code) {
  return http.STATUS_CODES[code] || 'Unknown Status';
}

/**
 * Utility functions for common operations
 */
const utils = {
  /**
   * Generate random hex string
   */
  generateHex(length = 8) {
    return Math.random().toString(16).substring(2, 2 + length);
  },

  /**
   * Generate random base64 string
   */
  generateBase64(length = 16) {
    return Buffer.from(Math.random().toString(36).substring(2, 2 + length)).toString('base64');
  },

  /**
   * Format timestamp to ISO string
   */
  formatTimestamp(date = new Date()) {
    return date.toISOString();
  },

  /**
   * Calculate percentage with specified decimal places
   */
  calculatePercentage(part, total, decimals = 2) {
    if (total === 0) return '0.00';
    return ((part / total) * 100).toFixed(decimals);
  },

  /**
   * Validate time range
   */
  validateTimeRange(from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new Error('Invalid date format');
    }
    
    if (fromDate >= toDate) {
      throw new Error('invalid interval: from > to');
    }
    
    return { from: fromDate, to: toDate };
  },

  /**
   * Add Gaussian noise for differential privacy
   */
  addGaussianNoise(value, sigma = 1) {
    // Box-Muller transformation for Gaussian noise
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return Math.round(value + (z0 * sigma));
  },

  /**
   * Deep clone object
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

module.exports = {
  setupCustomStatusCodes,
  getStatusMessage,
  ...utils
};
