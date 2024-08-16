// NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClock, faBell, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import NotificationChecker from './NotificationChecker';
import '../styles/NavBar.css';

const NavBar = ({ username }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <nav className="navbar">
      <ul className="nav-icons">
        <li className="nav-icon">
          <Link to="/add-dashboard">
            <FontAwesomeIcon icon={faPlus} />
          </Link>
        </li>
        <li className="nav-icon">
          <Link to="/timer">
            <FontAwesomeIcon icon={faClock} />
          </Link>
        </li>
        <li className="nav-icon">
          <div className="dropdown">
            <FontAwesomeIcon icon={faBell} onClick={toggleNotifications} />
            {showNotifications && (
              <div className="dropdown-content">
                <NotificationChecker />
                {/* Optionally, add a placeholder or actual notification content here */}
              </div>
            )}
          </div>
        </li>
        <li className="nav-icon">
          <Link to="/search">
            <FontAwesomeIcon icon={faSearch} />
          </Link>
        </li>
        <li className="nav-icon">
          <Link to="/profile">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
