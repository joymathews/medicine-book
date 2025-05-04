import React, { useState } from 'react';
import { auth, provider, signInWithPopup } from '../configurations/firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/Login.css';
import GoogleIcon from '../assets/google-icon.svg';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Set custom parameters to force account selection
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      console.log('User logged in:', user);
      navigate('/medicines');
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to login. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container page-container">
      <div className="login-card card-container">
        <h2 className="section-title text-center">Medicine Book</h2>
        {error && <div className="error-message">{error}</div>}
        <button 
          onClick={handleLogin} 
          disabled={isLoading}
          className="login-button"
        >
          {isLoading ? (
            'Signing in...'
          ) : (
            <>
              <img src={GoogleIcon} alt="Google" className="google-icon" />
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Login;