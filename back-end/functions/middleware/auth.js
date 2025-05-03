const { auth } = require('../config/firebase');
const { AuthError } = require('../errors/customErrors');

/**
 * Authentication middleware
 * @param {Object} req - Express request object
 * @returns {Object} Decoded Firebase auth token
 * @throws {AuthError} If authentication fails
 */
const extractBearerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('Authentication required');
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new AuthError('Invalid Authorization header format');
  }
  return parts[1];
};

const authenticate = async (req) => {
  const authHeader = req.headers.authorization;
  const idToken = extractBearerToken(authHeader);
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new AuthError('Invalid authentication token');
  }
};

module.exports = { authenticate };