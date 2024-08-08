import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css'; 


const Navbar = ({ username }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="/path/to/logo.png" alt="TaskMaster Logo" className="logo-image" />
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/home" className="nav-button">Home</Link>
        </li>
        <li>
          <Link to="/dashboards" className="nav-button">Dashboards</Link>
        </li>
        <li>
          <Link to="/inbox" className="nav-button">Inbox</Link>
        </li>
        <li>
          <Link to="/profile" className="nav-button">
            Profile ({username})
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
