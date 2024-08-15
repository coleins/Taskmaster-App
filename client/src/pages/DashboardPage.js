import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { gsap } from "gsap";
import { useHistory } from "react-router-dom"; // Import useHistory
import "../components/styles/DashboardPage.css";
import NavBar from "../components/Nav/NavBar";
import SideBar from "../components/Nav/SideBar";

const DashboardsPage = () => {
  const [dashboards, setDashboards] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [selectedDashboard, setSelectedDashboard] = useState(null);

  const cardContainerRef = useRef(null);
  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const history = useHistory(); // Initialize useHistory

  useEffect(() => {
    axios
      .get("https://taskmaster-app-capstone-project.onrender.com/dashboards", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setDashboards(response.data))
      .catch((error) => console.error("Error fetching dashboards:", error));

    gsap.fromTo(
      cardContainerRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    if (showAddModal) {
      gsap.fromTo(
        addModalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    } else if (showEditModal) {
      gsap.fromTo(
        editModalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [showAddModal, showEditModal]);

  const handleAddDashboard = () => {
    axios
      .post(
        "https://taskmaster-app-capstone-project.onrender.com/dashboards",
        { project_name: newDashboardName },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setDashboards([
          ...dashboards,
          { id: response.data.dashboard, project_name: newDashboardName },
        ]);
        setNewDashboardName("");
        setShowAddModal(false);
      })
      .catch((error) => console.error("Error adding dashboard:", error));
  };

  const handleEditDashboard = () => {
    axios
      .put(
        `https://taskmaster-app-capstone-project.onrender.com/dashboards/${selectedDashboard.id}`,
        { project_name: selectedDashboard.project_name },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        setDashboards(
          dashboards.map((dashboard) =>
            dashboard.id === selectedDashboard.id
              ? selectedDashboard
              : dashboard
          )
        );
        setSelectedDashboard(null);
        setShowEditModal(false);
      })
      .catch((error) => console.error("Error editing dashboard:", error));
  };

  const handleDeleteDashboard = (id) => {
    axios
      .delete(
        `https://taskmaster-app-capstone-project.onrender.com/dashboards/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        setDashboards(dashboards.filter((dashboard) => dashboard.id !== id));
      })
      .catch((error) => console.error("Error deleting dashboard:", error));
  };

  const handleDashboardClick = (id) => {
    history.push(`/tasks/${id}`); // Navigate to the TaskPage
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <div
        className={`container ${
          showAddModal || showEditModal ? "blurred" : ""
        }`}
      >
        <div className="container-content">
          <div className="card-container" ref={cardContainerRef}>
            <h2 className="title">Your Dashboards</h2>
            <Button
              variant="primary"
              className="mb-3"
              onClick={() => setShowAddModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Dashboard
            </Button>
            <ListGroup>
              {dashboards.map((dashboard) => (
                <ListGroup.Item
                  key={dashboard.id}
                  className="list-group-item"
                  onClick={() => handleDashboardClick(dashboard.id)} // Add onClick handler
                >
                  {dashboard.project_name}
                  <div className="float-end">
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDashboard(dashboard);
                        setShowEditModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDashboard(dashboard.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>

        {/* Add Dashboard Popup */}
        {showAddModal && (
          <div className="custom-modal" onClick={() => setShowAddModal(false)}>
            <div
              className="custom-modal-content"
              ref={addModalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <h4>Add New Dashboard</h4>
              <Form>
                <Form.Group controlId="formDashboardName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter project name"
                    value={newDashboardName}
                    onChange={(e) => setNewDashboardName(e.target.value)}
                  />
                </Form.Group>
              </Form>
              <div className="modal-actions">
                <Button
                  variant="primary"
                  onClick={handleAddDashboard}
                  className="action-buttons"
                >
                  Add
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  className="action-buttons"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Dashboard Popup */}
        {showEditModal && (
          <div className="custom-modal" onClick={() => setShowEditModal(false)}>
            <div
              className="custom-modal-content"
              ref={editModalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <h4>Edit Dashboard</h4>
              <Form>
                <Form.Group controlId="formEditDashboardName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter project name"
                    value={
                      selectedDashboard ? selectedDashboard.project_name : ""
                    }
                    onChange={(e) =>
                      setSelectedDashboard({
                        ...selectedDashboard,
                        project_name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Form>
              <div className="modal-actions">
                <Button
                  variant="primary"
                  onClick={handleEditDashboard}
                  className="action-buttons"
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                  className="action-buttons"
                >
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

export default DashboardsPage;
