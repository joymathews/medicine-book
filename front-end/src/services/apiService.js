import { httpsCallable } from 'firebase/functions';
import { functions } from '../configurations/firebase';
import { getAuth } from 'firebase/auth';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Adds a medicine to the database
 * @param {Object} medicineData - The medicine data to add
 * @returns {Promise<Object>} - The response from the server
 */
export const addMedicine = async (medicineData) => {
  try {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    
    const response = await fetch(`${API_BASE_URL}/addMedicine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(medicineData)
    });
    
    // Check if the response status is within the successful range (200-299)
    if (!response.ok) {
      // Try to parse error details if available
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      } catch (parseError) {
        // If parsing fails, throw a generic error with the status code
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    
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