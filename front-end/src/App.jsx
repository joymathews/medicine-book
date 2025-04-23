import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AddMedicine from './components/AddMedicine/AddMedicine';
import ProtectedRoute from './components/ProtectedRoute';
import { auth } from './configurations/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<Login setUser={setUser} />} />
      <Route 
        path="/add-medicine" 
        element={
          <ProtectedRoute user={user}>
            <AddMedicine user={user} />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;