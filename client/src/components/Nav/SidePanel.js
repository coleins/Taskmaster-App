import React from 'react';
import { useHistory } from 'react-router-dom'; 
import './Sidepanel.css';
import Clock from './Clock';
import logo from './logo.png';

const Sidebar = () => {
  const history = useHistory(); 

  return (
    <nav className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="TaskMaster Logo" className="logo" />
      </div>
      <div className="nav-buttons">
        <button className="nav-button" onClick={() => history.push('/home')}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </button>
        <button className="nav-button" onClick={() => history.push('/dashboards')}>
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboards</span>
        </button>
        <button className="nav-button" onClick={() => history.push('/inbox')}>
          <i className="fas fa-inbox"></i>
          <span>Inbox</span>
        </button>
      </div>
      <div className='clock'>
        <Clock />
      </div>
    </nav>
  );
};

export default Sidebar;
