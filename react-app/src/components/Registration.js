import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Link, useNavigate } from 'react-router-dom';
import background from "../assets/bg-image.jpeg"

const Registration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (password !== reenterPassword) {
      alert("Passwords don't match");
      return;
    }

    // Password validation regex pattern
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

    if (!passwordPattern.test(password)) {
      setPasswordError('Password must contain at least eight characters, at least one number, both lower and uppercase letters, and special characters.');
      return;
    }

    try {
      // Create a new user with email and password
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      navigate('/'); // Navigate to the login page after successful registration
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${background})`, backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh'
    }}>
    <div className="container">
      <div className="card">
        <h2 className="card-title">Registration</h2>
        <form className="card-body registration-form" onSubmit={handleRegistration}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Re-enter Password</label>
            <input
              type="password"
              className="form-control"
              value={reenterPassword}
              onChange={(e) => setReenterPassword(e.target.value)}
              required
            />
          </div>
          {passwordError && <p className="error-message" style={{color: "red", textAlign:"left"}}>{passwordError}</p>}
          <button type="submit" className="btn-action">
            Register
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Registration;
