import { httpsCallable } from 'firebase/functions';
import { functions } from '../configurations/firebase';
import { getAuth } from 'firebase/auth';

/**
 * Adds a medicine to the database
 * @param {Object} medicineData - The medicine data to add
 * @returns {Promise<Object>} - The response from the server
 */
export const addMedicine = async (medicineData) => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    
    const response = await fetch('http://localhost:5001/medicine-book-132df/us-central1/addMedicine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(medicineData)
    });
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to add medicine');
    }
    
    return data;
  } catch (error) {
    console.error('Error adding medicine:', error);
    throw error;
  }
};