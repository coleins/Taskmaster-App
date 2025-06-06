import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { api } from "../../../utils/api";
import "./SignUp.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const history = useHistory();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      await api.post("/users", { username, email, password });
      history.push("/login");
    } catch (error) {
      console.error("Register error", error);
    } finally {
      setLoading(false); // End loading
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
      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-password-button"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <button type="submit" disabled={loading} className="registerbtn">
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
