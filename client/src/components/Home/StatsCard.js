import React from "react";
import "./StatsCard.css";

const StatsCard = ({ view, currentStats, handleViewChange }) => {
  return (
    <div className="stats-card">
      <h2>{view.charAt(0).toUpperCase() + view.slice(1)} Stats</h2>
      <div className="stats">
        <div className="stat-item">
          <h3 className='stat-label'>Completed</h3>
          <p className='stat-count'>{currentStats.completed}</p>
        </div>
        <div className="stat-item">
          <h3 className='stat-label'>In Progress</h3>
          <p className='stat-count'>{currentStats.inProgress}</p>
        </div>
        <div className="stat-item">
          <h3 className='stat-label'>Pending</h3>
          <p className='stat-count'>{currentStats.pending}</p>
        </div>
      </div>
      <div className="view-toggle">
        <button
          onClick={() => handleViewChange("daily")}
          className={view === "daily" ? "active" : ""}
        >
          Daily
        </button>
        <button
          onClick={() => handleViewChange("weekly")}
          className={view === "weekly" ? "active" : ""}
        >
          Weekly
        </button>
        <button
          onClick={() => handleViewChange("monthly")}
          className={view === "monthly" ? "active" : ""}
        >
          Monthly
        </button>
      </div>
    </div>
  );
};

export default StatsCard;