import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/styles/DashboardPage.css';

const DashboardsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://taskmaster-app-capstone-project.onrender.com/dashboards');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateNewProject = async () => {
    try {
      const newProjectName = `Project ${String.fromCharCode(65 + projects.length)}`;
      const newProject = { name: newProjectName };
      
      const response = await axios.post('https://taskmaster-app-capstone-project.onrender.com', newProject);
      setProjects([...projects, response.data]);
    } catch (error) {
      console.error('Error creating new project:', error);
    }
  };

  return (
    <div className="dashboards-page">
      <h1>Your Projects</h1>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <ul className="projects-list">
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              {project.name}
            </li>
          ))}
        </ul>
      )}
      <button className="create-project-button" onClick={handleCreateNewProject}>
        Create New Project
      </button>
    </div>
  );
};

export default DashboardsPage;
