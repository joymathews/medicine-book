import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { auth } from '../../configurations/firebase';
import { signOut } from 'firebase/auth';
import '../../styles/common.css';
import '../../styles/MedicineList.css'; 

const MedicineList = ({ user }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper function to format dosage object
  const formatDosage = (dosage) => {
    if (!dosage) return 'N/A';
    
    const times = [];
    
    if (dosage.morning?.enabled) {
      const relation = dosage.morning.foodRelation ? ` (${formatFoodRelation(dosage.morning.foodRelation)})` : '';
      times.push(`Morning${relation}`);
    }
    
    if (dosage.noon?.enabled) {
      const relation = dosage.noon.foodRelation ? ` (${formatFoodRelation(dosage.noon.foodRelation)})` : '';
      times.push(`Noon${relation}`);
    }
    
    if (dosage.night?.enabled) {
      const relation = dosage.night.foodRelation ? ` (${formatFoodRelation(dosage.night.foodRelation)})` : '';
      times.push(`Night${relation}`);
    }
    
    return times.length > 0 ? times.join(', ') : 'N/A';
  };
  
  // Helper to format food relation
  const formatFoodRelation = (relation) => {
    if (!relation) return '';
    
    const relationMap = {
      'BEFORE': 'Before Food',
      'AFTER': 'After Food',
      'WITH': 'With Food'
    };
    
    return relationMap[relation] || relation;
  };
  
  // Helper to format duration
  const formatDuration = (duration) => {
    if (!duration || !duration.value) return 'N/A';
    
    const typeMap = {
      'DAYS': 'day(s)',
      'WEEKS': 'week(s)',
      'MONTHS': 'month(s)'
    };
    
    const type = typeMap[duration.type] || duration.type.toLowerCase();
    return `${duration.value} ${type}`;
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Get the auth token
        const token = await user.getIdToken();
        
        // Call the getMedicines API
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiUrl}/getMedicines`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const responseData = await response.json();
        
        if (responseData.success) {
          setMedicines(responseData.data || []);
        } else {
          throw new Error(responseData.message || 'Failed to fetch medicines');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medicines:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header title="Your Medicines" onLogout={handleLogout} />
        <div className="content-container">
          <div className="card-container text-center">
            <p>Loading medicines...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Header title="Your Medicines" onLogout={handleLogout} />
        <div className="content-container">
          <div className="card-container error-container text-center">
            <p>Error loading medicines: {error}</p>
            <button 
              className="btn primary-btn" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header title="Your Medicines" onLogout={handleLogout} />
      
      <div className="content-container">
        {medicines.length === 0 ? (
          <div className="card-container no-medicines text-center">
            <p>You don't have any medicines yet.</p>
            <p>Click on "Add Medicine" in the header to add your first medicine.</p>
          </div>
        ) : (
          <div className="card-container">
            <h2 className="section-title">Your Medicine Schedule</h2>
            <div className="table-container">
              <table className="medicines-table">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Doctor</th>
                    <th>Purpose</th>
                    <th>Dosage</th>
                    <th>Duration</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map(medicine => (
                    <tr key={medicine.id}>
                      <td>{medicine.medicineName || 'N/A'}</td>
                      <td>{medicine.doctor || 'N/A'}</td>
                      <td>{medicine.purpose || 'N/A'}</td>
                      <td>{formatDosage(medicine.dosage)}</td>
                      <td>{formatDuration(medicine.duration)}</td>
                      <td>{medicine.notes || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineList;