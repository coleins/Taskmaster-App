import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import './User.css';

const User = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    // Handle user information update logic here
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    setShowDeleteModal(false);
  };

  return (
    <div className="user-container">
      <h2>User Settings</h2>

      <section className="user-info">
        <h3>Update Information</h3>
        <Form onSubmit={handleUpdate}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter new username" />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter new email" />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter new password" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update Information
          </Button>
        </Form>
      </section>

      <section className="user-account-settings">
        <h3>Account Settings</h3>
        <Button variant="warning">Manage Notifications</Button>
        <Button variant="secondary">Privacy Settings</Button>
      </section>

      <section className="delete-account">
        <h3>Danger Zone</h3>
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </Button>
      </section>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default User;
