import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../services/Auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function RegisterUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res= await axios.post('http://localhost:8000/api/register', form, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      toast.success(res.data.message || 'User registered successfully!');
      navigate('/admin'); // or wherever you want to go after registration
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error(err.response?.data?.message || 'Registration failed. Please check form or try again.');
    }
  };

  return (
    <div>
       <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0f214d' }}>
        <div className="container-fluid d-flex justify-content-between">
          <span className="navbar-brand">Register New User</span>
          <div className=" d-flex ms-auto">
            <button className="btn btn-outline-light me-4 col-md-4" id= "home-btn" onClick={() => navigate('/admin')}>Home</button>
            <button className="btn btn-outline-light me-4 col-md-6" id= "add-user-btn" onClick={() => navigate('/admin/register-user')}>Add User</button>
          </div>
        </div>
      </nav>
      
      <div className="container card p-4 mt-5">
      <h4 className="mb-4">Register New User</h4>
      <p className="text-muted">Please fill in the details below to register a new user.</p>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#0f214d' }}>Register User</button>
      </form>
      </div>
    </div>
  );
}

export default RegisterUser;
