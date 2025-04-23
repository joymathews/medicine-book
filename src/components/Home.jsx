import React from 'react';
import { auth } from '../configurations/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="home-container">
      <h2>Welcome to the Medicine Book Home Page</h2>
      <p>Explore a wealth of medical information at your fingertips.</p>
      
      <button 
        onClick={handleLogout} 
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;