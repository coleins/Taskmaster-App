import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { gsap } from "gsap";
import { useParams } from "react-router-dom";
import TaskCard from "../components/Project/TaskCard";  // Import TaskCard component
import "../components/styles/Taskspage.css";
import NavBar from "../components/Nav/NavBar";
import SideBar from "../components/Nav/SideBar";

const TaskPage = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "low",
    status: "pending",
  });

  const taskContainerRef = useRef(null);
  const addModalRef = useRef(null);

  useEffect(() => {
    axios
      .get(`https://taskmaster-app-capstone-project.onrender.com/dashboards/${id}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));

    gsap.fromTo(
      taskContainerRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, [id]);

  useEffect(() => {
    if (showAddModal) {
      gsap.fromTo(
        addModalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [showAddModal]);

  const handleAddTask = () => {
    axios.post(
        `https://taskmaster-app-capstone-project.onrender.com/tasks/${id}`,
        {...newTask, dashboard_id: id},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask({
          title: "",
          description: "",
          due_date: "",
          priority: "low",
          status: "pending",
        });
        setShowAddModal(false);
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  return (
    <>
    <NavBar />
    <SideBar />
    <div>
      <h2 className="title">Tasks</h2>
      <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
        Add Task
      </Button>
      <div className="task-container" ref={taskContainerRef}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />  // Use TaskCard component here
        ))}
      </div>

      {showAddModal && (
  <div className="custom-modal" onClick={() => setShowAddModal(false)}>
    <div className="custom-modal-content" ref={addModalRef} onClick={(e) => e.stopPropagation()}>
      <h4>Add New Task</h4>
      <Form>
        <Form.Group controlId="formTaskTitle" className="form-group">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formTaskDescription" className="form-group">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter task description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formTaskDueDate" className="form-group">
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="date"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formTaskPriority" className="form-group">
          <Form.Label>Priority</Form.Label>
          <Form.Control
            as="select"
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formTaskStatus" className="form-group">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <div className="modal-actions">
        <Button variant="primary" onClick={handleAddTask} className="action-buttons">
          Add Task
        </Button>
        <Button variant="secondary" onClick={() => setShowAddModal(false)} className="action-buttons">
          Cancel
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
    </>
  );
};

export default TaskPage;
