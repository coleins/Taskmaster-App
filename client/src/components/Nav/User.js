import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { api } from '../../utils/api'; // Updated import
import '../styles/User.css';
import NavBar from '../Nav/NavBar';
import SideBar from '../Nav/SideBar';

const User = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No access token found');

        const response = await api.get('/current_user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user data:', error.response || error.message);
        setError('Failed to load user data. Please check your network connection or login status.');
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No access token found');

      await api.put(`/users/${user.id}`, {
        username,
        email,
        password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User updated successfully!');
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error.response || error.message);
      alert('Error updating user.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No access token found');

        await api.delete(`/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token');
        history.push('/');
      } catch (error) {
        console.error('Error deleting user:', error.response || error.message);
        alert('Error deleting user.');
      }
    }
  };

  const handleEmailVerification = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No access token found');

      // Add your email verification logic here
      alert('Email verification process initiated.');
    } catch (error) {
      console.error('Error verifying email:', error.response || error.message);
      alert('Error verifying email.');
    }
  };

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <NavBar />
      <SideBar />
      <div className={`user-settings ${editModalOpen ? 'blurred' : ''}`}>
        <h1>Your Details</h1>
        <div className="details-section">
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
          <button className="edit-btn" onClick={() => setEditModalOpen(true)}>Edit Details</button>
        </div>

        {/* Edit Details Popup */}
        {editModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Details</h2>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label htmlFor="edit-username">Username</label>
                  <input
                    type="text"
                    id="edit-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-email">Email</label>
                  <input
                    type="email"
                    id="edit-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-password">Password</label>
                  <input
                    type="password"
                    id="edit-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditModalOpen(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        <div className="settings-section">
          <h2>Privacy Settings</h2>
          <button className="verify-email-btn" onClick={handleEmailVerification}>Verify Email</button>
          {/* Add more privacy settings as needed */}
        </div>
        <div className="danger-zone">
          <button className="delete-account" onClick={handleDelete}>Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default User;
