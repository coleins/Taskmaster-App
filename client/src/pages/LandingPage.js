import React from 'react';
import { useHistory } from 'react-router-dom';
import '../components/styles/LandingPage.css'; 

const LandingPage = () => {
  const history = useHistory();

  const handleSignUp = () => {
    history.push('/signup'); // Redirect to the sign-up page
  };

  const handleLogin = () => {
    history.push('/login'); // Redirect to the login page
  };

  return (
    <div className="landing-page">
      <h1>Welcome to Taskmaster</h1>
      <p>Your one-stop solution for managing tasks efficiently.</p>
      <div className="button-group">
        <button className="sign-up-button" onClick={handleSignUp}>Sign Up</button>
        <button className="login-button" onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
};

export default LandingPage;
