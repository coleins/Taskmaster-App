import React from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import "../styles/TaskCard.css";

const TaskCard = ({ task }) => {
  const handleInvite = () => {
    const email = prompt("Enter the email address to invite:");
    if (email) {
      axios.post(
        `https://taskmaster-app-capstone-project.onrender.com/tasks/${task.id}/invite`,
        { email },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(response => alert(response.data.message))
      .catch(error => console.error("Error sending invitation:", error));
    }
  };

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
          <Button variant="info" className="task-action-button" onClick={handleInvite}>Invite</Button>
        </div>
      </Card.Body>
    </Card>
  );
};
export default TaskCard;
