import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Use useHistory instead of useNavigate
import { api, setAuthToken } from '../../../utils/api';
import './login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const history = useHistory(); // Use useHistory instead of useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('https://taskmaster-app-capstone-project.onrender.com/login', { email, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setAuthToken(access_token);
      window.alert('Login successful!'); 
      history.push('/home'); // Use history.push instead of navigate
    } catch (error) {
      console.error('Login error', error);
      window.alert('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
        className='showbtn'
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          
        >
          {showPassword ? 'Hide' : 'Show'} {/* Toggle button text */}
        </button>
      </div>
      <button className='loginbtn' type="submit">Login</button>
    </form>
  );
};

export default Login;
