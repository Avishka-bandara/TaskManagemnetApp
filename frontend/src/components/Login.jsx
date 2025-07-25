// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

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
  finally {
    setLoading(false);
  }
  };

  return (
      <>
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
          style={{ zIndex: 1050 }}
        >
          <div className="spinner-grow " style={{ color: '#0f214d' }} role="status"></div>
          <strong className="text-primary">Logging in...</strong>
        </div>
      )}
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

        </form>
      </div>
    </div>
  </>
  );
}

export default Login;
