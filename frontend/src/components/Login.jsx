// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

     try {
    const res = await axios.post('http://localhost:8000/api/login', {
      email,
      password,
    });

    const token = res.data.token;
    localStorage.setItem('token', token);

    // Fetch user info now
    const userRes = await axios.get('http://localhost:8000/api/fetch-user', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const role = userRes.data.role;
    localStorage.setItem('role', role);

    setError('');
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  }
  };

  return (
    <div className=" d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4" style={{ color: '#0f214d' }}>Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email address</label>
            <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#0f214d' }}>Login</button>
          {/* <div className="text-center mt-3">
            <small>
              Don't have an account? <a href="/register" style={{ color: '#0f214d' }}>Register</a>
            </small>
          </div> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
