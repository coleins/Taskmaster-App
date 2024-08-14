import React from "react";
import { Card, Button } from "react-bootstrap";
import "../styles/TaskCard.css";

const TaskCard = ({ task }) => {
  console.log(task); // Add this line to check the task object structure

  return (
    <Card className="task-card">
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        <Card.Text>{task.description}</Card.Text>
        <Card.Text>Due: {task.due_date}</Card.Text>
        <Card.Text>Priority: {task.priority}</Card.Text>
        <Card.Text>Status: {task.status}</Card.Text>
        <div className="task-actions">
          <Button variant="secondary" className="task-action-button">Edit</Button>
          <Button variant="danger" className="task-action-button">Delete</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskCard;
