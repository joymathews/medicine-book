const { db } = require('../config/firebase');
const { validateMedicineData } = require('../validators/medicineValidator');
const { createTimestamp } = require('../utils/timestamp');

/**
 * Handler for adding medicine
 * @param {Object} req - Express request object 
 * @param {Object} authData - Authentication data
 * @returns {Object} Response object
 */
async function handleAddMedicine(req, authData) {
  const medicineData = req.body;
  const userId = authData.uid;
  
  // Validate data
  validateMedicineData(medicineData);
  
  // Prepare data for storage
  const dataToStore = {
    ...medicineData,
    userId,
    createdAt: createTimestamp()
  };
  
  // Store in Firestore
  const docRef = await db.collection('medicines').add(dataToStore);
  
  return {
    success: true,
    medicineId: docRef.id,
    message: 'Medicine details saved successfully!'
  };
}

module.exports = { handleAddMedicine };