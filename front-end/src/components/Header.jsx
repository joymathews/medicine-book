import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css'; 

const Header = ({ onLogout, title = "Medicine Book" }) => {
  const location = useLocation();
  
  return (
    <div className="header">
      <div className="header-title">
        <h1>{title}</h1>
      </div>
      
      <div className="header-navigation">
        <nav>
          <Link 
            to="/medicines" 
            className={location.pathname === '/medicines' ? 'active' : ''}
          >
            Medicine List
          </Link>
          
          <Link 
            to="/add-medicine" 
            className={location.pathname === '/add-medicine' ? 'active' : ''}
          >
            Add Medicine
          </Link>
        </nav>
        
        <button 
          onClick={onLogout} 
          className="logout-button"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;