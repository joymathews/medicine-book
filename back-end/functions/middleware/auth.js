const { auth } = require('../config/firebase');
const { AuthError } = require('../errors/customErrors');

/**
 * Authentication middleware
 * @param {Object} req - Express request object
 * @returns {Object} Decoded Firebase auth token
 * @throws {AuthError} If authentication fails
 */
const authenticate = async (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('Authentication required');
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new AuthError('Invalid authentication token');
  }
};

module.exports = { authenticate };