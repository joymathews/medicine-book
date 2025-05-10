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

/**
 * Handles retrieving medicines for a user
 * 
 * @param {Object} req - Express request object
 * @param {Object} authData - Authentication data
 * @returns {Promise<Array>} Array of medicine objects
 */
async function handleGetMedicines(req, authData) {
  // Get the user ID from auth data
  const { uid } = authData;
  
  // Optional query parameters for filtering
  const { active, name, category } = req.query;
  
  try {
    // Start with base query for the user's medicines
    let medicinesQuery = db.collection('medicines').where('userId', '==', uid);
    
    // Apply filters if provided
    if (active !== undefined) {
      const isActive = active === 'true';
      medicinesQuery = medicinesQuery.where('active', '==', isActive);
    }
    
    if (name) {
      // Use array-contains for name search (assuming you have a nameKeywords array field)
      // Or implement a more sophisticated search mechanism
      medicinesQuery = medicinesQuery.where('nameKeywords', 'array-contains', name.toLowerCase());
    }
    
    if (category) {
      medicinesQuery = medicinesQuery.where('category', '==', category);
    }
    
    // Execute the query
    const snapshot = await medicinesQuery.get();
    
    // Transform the data
    const medicines = [];
    snapshot.forEach(doc => {
      medicines.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return medicines;
    
  } catch (error) {
    console.error('Error getting medicines:', error);
    throw error;
  }
}

module.exports = { handleAddMedicine, handleGetMedicines };