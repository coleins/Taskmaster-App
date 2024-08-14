import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Card } from 'react-bootstrap';
import "../components/styles/Taskspage.css"; // Create this CSS file
import NavBar from '../components/Nav/NavBar';
import SideBar from '../components/Nav/SideBar';

const Taskspage = () => {
  const { dashboardId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get(`https://taskmaster-app-capstone-project.onrender.com/dashboards/${dashboardId}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [dashboardId]);

  return (
    <>
    <NavBar />
    <SideBar />
    <div className="tasks-container">
      <h2>Tasks</h2>
      <Button variant="primary" className="mb-3">
        Add New Task
      </Button>
      <div className="tasks-grid">
        {tasks.map((task) => (
          <Card key={task.id} className="task-card">
            <Card.Body>
              <Card.Title>{task.name}</Card.Title>
              <Card.Text>{task.description}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
    </>
  );
};

export default Taskspage;
