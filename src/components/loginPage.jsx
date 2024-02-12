
// export default LoginPage;
import React, { useState,useEffect } from "react";
import instance from "../API/axiosInstance.js";
import Chat from './chat'; // Import the Chat component
import ContactForm from './contactForm'; // Import the ContactPage component
import '../App.css';

function LoginPage({ onLogin }) {
  const [userName, setUsername] = useState("");
  const [passWord, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // State to track login status
  useEffect(() => {
    // Check if the user is already logged in based on localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      setLoggedIn(true);
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post(`/users/login`, {
        userName,
        passWord,
      });
      if (response.status === 200) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', response.data.token);
        setLoggedIn(true); // Set loggedIn to true upon successful login
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
    <h2>Login</h2>
    {loggedIn ? ( // Conditionally render components based on login status
      <>
        <Chat /> {/* Render Chat component */}
      </>
    ) : (
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={passWord}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    )}
    {error && <div className="error-message">{error}</div>}
  </div>
  )  
}

export default LoginPage;
