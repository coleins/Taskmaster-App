import React from 'react';
import PropTypes from 'prop-types';

const ProjectCard = ({ title, description, onClick }) => {
  return (
    <div className="project-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

ProjectCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default ProjectCard;
