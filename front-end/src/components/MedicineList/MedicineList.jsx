import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { auth } from '../../configurations/firebase';
import { signOut } from 'firebase/auth';
import '../../styles/MedicineList.css'; 

const MedicineList = ({ user }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Here you would fetch the user's medicines from your database
    // This is just dummy data for demonstration
    const fetchMedicines = async () => {
      try {
        // Replace this with your actual API call
        // const response = await fetch(`your-api/medicines/${user.uid}`);
        // const data = await response.json();
        
        // Dummy data
        const dummyData = [
          {
            id: '1',
            name: 'Amoxicillin',
            prescriptionDate: '2025-04-28',
            duration: '10 days',
            recurrencePattern: 'Every 8 hours',
            whenToTake: 'After meals'
          },
          {
            id: '2',
            name: 'Lisinopril',
            prescriptionDate: '2025-04-15',
            duration: '30 days',
            recurrencePattern: 'Daily',
            whenToTake: 'Morning'
          }
        ];
        
        setMedicines(dummyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medicines:', error);
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

  if (loading) return <div>Loading medicines...</div>;

  return (
    <div className="medicine-list-container">
      <Header title="Your Medicines" onLogout={handleLogout} />
      
      <div className="medicine-list-content">
        {medicines.length === 0 ? (
          <div className="no-medicines">
            <p>You don't have any medicines yet.</p>
            <p>Click on "Add Medicine" in the header to add your first medicine.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="medicines-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Prescription Date</th>
                  <th>Duration</th>
                  <th>Recurrence Pattern</th>
                  <th>When to Take</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(medicine => (
                  <tr key={medicine.id}>
                    <td>{medicine.name}</td>
                    <td>{medicine.prescriptionDate}</td>
                    <td>{medicine.duration}</td>
                    <td>{medicine.recurrencePattern}</td>
                    <td>{medicine.whenToTake}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineList;