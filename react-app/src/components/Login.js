import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Link, useNavigate } from 'react-router-dom';
import background from "../assets/bg-image.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in the user with email and password
      await firebase.auth().signInWithEmailAndPassword(email, password);
      //alert('Login successful');
      navigate('/home'); // Navigate to the home page after successful login
    } catch (error) {
      setAuthError('Invalid email or password.');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div className="container">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {authError && (
                <p className="error-message" style={{ color: 'red', textAlign: 'left' }}>
                  {authError}
                </p>
              )}
              <button type="submit" className="btn-action">
                Login
              </button>
            </form>
            <p className="text-center mt-3">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
