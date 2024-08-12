import React from 'react';
import './Sidepanel.css'; // Import the CSS file for styling
import Clock from './Clock';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="logo-container">
        <img src="path/to/your/logo.png" alt="TaskMaster Logo" className="logo" />
      </div>
      <div className="nav-buttons">
        <div className='nav-button'>
          <i className="fas fa-home"></i>Home
        </div>
        <div className='nav-button'>
          <i className="fas fa-tachometer-alt"></i> Dashboards
        </div>
        <div className='nav-button'>
          <i className="fas fa-inbox"></i> Inbox
        </div>
      </div>
      <div className='clock'>
      <Clock/>
      </div>
    </nav>
  
  );
};

export default Sidebar;
