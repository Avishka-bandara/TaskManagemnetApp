// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {      
      
      await axios.post('http://localhost:8000/api/register', formData);
      setError('');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4" style={{ color: '#0f214d' }}>Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" className="form-control" required value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#0f214d' }}>Register</button>
          <div className="text-center mt-3">
            <small>
              Already have an account? <a href="/" style={{ color: '#0f214d' }}>Login</a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
