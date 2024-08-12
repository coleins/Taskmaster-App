import React from 'react';
import './Recentscard.css';

const RecentsCard = ({ recentTasks }) => {
  return (
    <div className="recents-card">
      <h3 className="recents-card-title">Recent Tasks</h3>
      <ul className="recents-list">
        {recentTasks.map((task, index) => (
          <li key={index} className="recents-item">
            <div className="task-name">{task.name}</div>
            <div className="task-dashboard">{task.dashboard}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentsCard;
