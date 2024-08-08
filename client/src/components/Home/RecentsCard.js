import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p>Due: {task.due_date}</p>
      <p>Status: {task.status}</p>
    </div>
  );
};

export default TaskCard;