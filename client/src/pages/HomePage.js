// This is just a dummy homepage for testing.feel free to change it
import React from 'react';
import { useHistory } from 'react-router-dom';
import "../components/Nav/NavBar"
import Navbar from '../components/Nav/NavBar';

const HomePage = () => {
  const history = useHistory();

  const handleLogout = () => {
    // Clear the token and redirect to the login page
    localStorage.removeItem('token');
    history.push('/login');
  };

  const goToProfile = () => {
    history.push('/profile');
  };

  return (
    <>
    <Navbar/>
    <div>
      <h1>Welcome to TaskMaster!</h1>
      <p>Your one-stop solution for task management.</p>
      <button onClick={goToProfile}>
        Go to Profile
      </button>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
    </>
  );
};
export default HomePage;
