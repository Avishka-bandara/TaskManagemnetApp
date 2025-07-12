import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, removeToken } from '../services/Auth';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [taskForm, setTaskForm] = useState({ title: '', description: '', due_date: '', assigned_user_id: '' });
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  useEffect(() => {
    // fetchTasks();
    fetchUsers();
  }, []);

  // const fetchTasks = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:8000/api/user/tasks', config); // You should have this route for admin
  //     setTasks(res.data);
  //   } catch (err) {
  //     console.error('Failed to fetch tasks', err);
  //   }
  // };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }); 
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  const handleTaskChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/task', taskForm, config);
      alert('Task created successfully');
      setTaskForm({ title: '', description: '', due_date: '', assigned_user_id: '' });
      // fetchTasks();
    } catch (err) {
      console.error('Failed to create task', err);
      alert('Task creation failed');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0f214d' }}>
        <div className="container-fluid">
          <span className="navbar-brand">Admin Dashboard</span>
          <div className="ms-auto">
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Create Task Form */}
      <div className="container mt-4">
        <div className="card p-3 mb-5" style={{ backgroundColor: '#f8f9fa' }}>
        <h4>Create New Task</h4>
        <form onSubmit={handleCreateTask} className="mb-2">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Title</label>
              <input type="text" name="title" className="form-control" required value={taskForm.title} onChange={handleTaskChange} />
            </div>
            
            <div className="col-md-6 mb-3">
              <label>Due Date</label>
              <input type="date" name="due_date" className="form-control" required value={taskForm.due_date} onChange={handleTaskChange} />
            </div>
          </div>
          <div className="row">
          <div className="col-md-6 mb-3">
            <label>Description</label>
            <textarea name="description" className="form-control" required value={taskForm.description} onChange={handleTaskChange}></textarea>
          </div>
          <div className="col-md-6 mb-3">
            <label>Assign To</label>
            <select name="assigned_user_id" className="form-select" required value={taskForm.assigned_user_id} onChange={handleTaskChange}>
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
              </div>
          </div>
          <button type="submit" className="btn text-white col-md-2" style={{ backgroundColor: '#0f214d' }}>Create Task</button>
        </form>
        </div>

        {/* Task Table */}
        <h4>All Tasks</h4>
        <table className="table table-bordered table-striped mb-5 mt-3">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.user?.name || 'Unassigned'}</td>
                <td>{task.status}</td>
                <td>{task.progress || 'Not started'}</td>
                <td>{task.due_date}</td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="text-center">No tasks found</td></tr>
            )}
          </tbody>
        </table>

        {/* User Table */}
        <h4>All Users</h4>
        <table className="table table-bordered table-striped">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="text-center">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
