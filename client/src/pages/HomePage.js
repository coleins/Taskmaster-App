// HomePage.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Nav/SidePanel';
import RecentsCard from '../components/Home/RecentsCard';
import StatsCard from '../components/Home/StatsCard';
import '../components/styles/Homepage.css';
import { animateCards } from '../animations'; 

const HomePage = () => {
  const [view, setView] = useState('daily'); 

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const recentTasks = [
    { name: 'Design Navbar', dashboard: 'UI/UX' },
    { name: 'Fix Login Bug', dashboard: 'Backend' },
    { name: 'Prepare Presentation', dashboard: 'Marketing' },
  ];

  // Dummy stats for tasks
  const stats = {
    daily: { completed: 5, inProgress: 3, pending: 2 },
    weekly: { completed: 20, inProgress: 15, pending: 5 },
    monthly: { completed: 80, inProgress: 40, pending: 10 }
  };

  const currentStats = stats[view];

  useEffect(() => {
    animateCards(); // Trigger animation on component mount
  }, []);

  return (
    <>
      <div className='home'>
        <Sidebar />
        <div className='homepage-container'>
          <RecentsCard recentTasks={recentTasks} />
          <StatsCard
            view={view}
            currentStats={currentStats}
            handleViewChange={handleViewChange}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
