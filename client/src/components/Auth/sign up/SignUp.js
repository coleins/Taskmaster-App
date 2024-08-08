import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Use useHistory instead of useNavigate
import { api } from '../../../utils/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory(); // Use useHistory instead of useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('https://taskmaster-app-capstone-project.onrender.com/users', { username, email, password });
      history.push('/login'); // Use history.push instead of navigate
    } catch (error) {
      console.error('Register error', error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
