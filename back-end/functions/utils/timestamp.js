const { admin } = require('../config/firebase');

/**
 * Create timestamp with fallback
 * @returns {Object|string} Firestore server timestamp or ISO date string
 */
function createTimestamp() {
  try {
    return admin.firestore.FieldValue.serverTimestamp();
  } catch (error) {
    console.warn('Failed to create server timestamp, using Date instead:', error);
    return new Date().toISOString();
  }
}

module.exports = { createTimestamp };