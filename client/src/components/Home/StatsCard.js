import React from 'react';

const StatsCard = ({ stats }) => {
  return (
    <div>
      <h4>Tasks Completed: {stats.tasksCompleted}</h4>
      <h4>Tasks Remaining: {stats.tasksRemaining}</h4>
    </div>
  );
};

export default StatsCard;