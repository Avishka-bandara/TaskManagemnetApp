import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import './App.css';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/register-user" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roleRequired="user">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
       <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
