const functions = require('firebase-functions');
const cors = require('./middleware/cors');
const { authenticate } = require('./middleware/auth');
const { handleAddMedicine, handleGetMedicines } = require('./handlers/medicineHandlers');
const { AuthError, ValidationError } = require('./errors/customErrors');

// Firebase is now initialized in config/firebase.js

/**
 * Add a new medicine
 */
exports.addMedicine = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Method validation
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ 
          success: false, 
          message: 'Method not allowed' 
        });
      }
      
      // Authentication
      const authData = await authenticate(req);
      
      // Handle the request
      const result = await handleAddMedicine(req, authData);
      
      // Return success response
      return res.status(200).json(result);
      
    } catch (error) {
      // Handle different types of errors
      console.error('Error in addMedicine:', error);
      
      if (error instanceof AuthError) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          errors: error.errors
        });
      }
      
      // Default error handler
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing your request'
      });
    }
  });
});

/**
 * Get medicines for a user
 */
exports.getMedicines = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Method validation
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ 
          success: false, 
          message: 'Method not allowed' 
        });
      }
      
      // Authentication
      const authData = await authenticate(req);
      
      // Handle the request
      const result = await handleGetMedicines(req, authData);
      
      // Return success response
      return res.status(200).json({
        success: true,
        data: result
      });
      
    } catch (error) {
      // Handle different types of errors
      console.error('Error in getMedicines:', error);
      
      if (error instanceof AuthError) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }
      
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          errors: error.errors
        });
      }
      
      // Default error handler
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing your request'
      });
    }
  });
});

