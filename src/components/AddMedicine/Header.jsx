import React from 'react';

const Header = ({ onLogout }) => {
  return (
    <div className="header">
      <h1>Add Medicine</h1>
      <button 
        onClick={onLogout} 
        className="logout-button"
        aria-label="Logout"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;