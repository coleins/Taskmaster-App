// src/components/Nav/NavBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClock, faBell, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import PomodoroTimer from './Timer';

import '../styles/NavBar.css';

const NavBar = ({ username }) => {
  const [showTimer, setShowTimer] = useState(false);
  // const location = useLocation();

  return (
    <nav className="navbar">
      <ul className="nav-icons">
        <li className="nav-icon">
          <Link to="/add-dashboard">
            <FontAwesomeIcon icon={faPlus} />
          </Link>
        </li>
        <li className="nav-icon">
          <button onClick={() => setShowTimer(!showTimer)}>
            <FontAwesomeIcon icon={faClock} />
          </button>
        </li>
        <li className="nav-icon">
          <Link to="/notifications">
            <FontAwesomeIcon icon={faBell} />
          </Link>
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
      {showTimer && <PomodoroTimer />}
    </nav>
  );
};

export default NavBar;
