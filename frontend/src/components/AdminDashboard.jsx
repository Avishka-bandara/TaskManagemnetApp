import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, removeToken } from '../services/Auth';
import { useNavigate } from 'react-router-dom';
import EditOffCanvas from './EditOffCanvas';

function AdminDashboard() {
  const navigate = useNavigate();
  const [taskForm, setTaskForm] = useState({ title: '', description: '', due_date: '', assigned_user_id: '' });
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(true);


  

  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const openEditCanvas = (task) => {
    setEditingTask(task);
    setShowEdit(true);
  };

  const openUserEditCanvas = (user) => {
  setEditingUser(user);
  setShowUserEdit(true);
  };


  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);



  const fetchTasks = async () => {
    try {
      setLoadingTasks(true); 
      const res = await axios.get('http://localhost:8000/api/user/tasks', config); 
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingTasks(true); 
      const res = await axios.get('http://localhost:8000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoadingTasks(false);
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
      // alert('Task created successfully');
      setTaskForm({ title: '', description: '', due_date: '', assigned_user_id: '' });
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task', err);
      alert('Task creation failed');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/task/${taskId}`, config);
      alert('Task deleted successfully');
      fetchTasks(); // Refresh task list
    } catch (err) {
      console.error('Failed to delete task', err);
      alert('Task deletion failed');
    }
  };
  const handleUpdateTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:8000/api/task/${editingTask.id}`, editingTask, config);

      alert('Task updated successfully');
      setShowEdit(false); // close off-canvas
      fetchTasks();       // refresh task list
    } catch (err) {
      console.error('Failed to update task', err);
      alert('Task update failed');
    }
  };

const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/api/update-user/${editingUser.id}`, editingUser, config); // Adjust route if needed
      alert('User updated successfully');
      setShowUserEdit(false);
      fetchUsers(); // Re-fetch user list after update
    } catch (err) {
      console.error('Failed to update user', err);
      alert('User update failed');
    }
  };




  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0f214d' }}>
        <div className="container-fluid d-flex justify-content-between">
          <span className="navbar-brand">Admin Dashboard</span>
          <div className=" d-flex ms-auto">
            <button className="btn btn-outline-light me-4 col-md-3" id= "home-btn" href="/admin">Home</button>
            <button className="btn btn-outline-light me-4 col-md-4" id= "add-user-btn" onClick={() => navigate('/admin/register-user')}>Add User</button>
            <button className="btn btn-outline-light col-md-3" id= "logout-btn" onClick={handleLogout}>Logout</button>
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
              <Select
                name="assigned_user_id"
                options={users.map((user) => ({
                  value: user.id,
                  label: `${user.name} (${user.email})`
                }))}
                value={
                  users
                    .map((user) => ({
                      value: user.id,
                      label: `${user.name} (${user.email})`
                    }))
                    .find((option) => option.value === taskForm.assigned_user_id) || null
                }
                onChange={(selectedOption) =>
                  setTaskForm({ ...taskForm, assigned_user_id: selectedOption?.value || '' })
                }
                isClearable
                placeholder="Select User"
              />
              </div>
            </div>
            <button type="submit" className="btn text-white col-md-2" style={{ backgroundColor: '#0f214d' }}>Create Task</button>
          </form>
        </div>

        {/* Task Table */}
        <h4>All Tasks</h4>
        <table className="table table-bordered table-striped mb-5 mt-3 align-middle text-center ">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingTasks ? (
              <tr>
                <td colSpan="6" className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : 
            tasks.length > 0 ? tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.user?.name || 'Unassigned'}</td>
                <td>{task.status ? (
                  <span className={`badge 
                      ${task.status === 'pending' ? 'bg-warning text-dark' :
                      task.status === 'in_progress' ? 'bg-info text-dark' :
                        task.status === 'completed' ? 'bg-success' : 'bg-secondary'}
                      `}>
                    {task.status.replace('_', ' ')}
                  </span>
                ) : (
                <span className="badge bg-primary">Not started</span>

                )}
                </td>
                <td>{task.due_date}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                  <button className="btn btn-sm btn-secondary ms-2"  onClick={() => openEditCanvas(task)}>Edit</button>
                </td>
              </tr>
            )) : (
              <tr>
                {/* <td colSpan="6" className="text-center">No tasks found</td> */}
              </tr>
            )}
            
          </tbody>
        </table>
        

        {/* User Table */}
        <h4>All Users</h4>
        <table className="table table-bordered table-striped align-middle text-center">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              {/* <th>Active</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
             {loadingTasks ? (
              <tr>
                <td colSpan="6" className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : 
            users.length > 0 ? users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(user.id)}>Delete</button>
                  <button className="btn btn-sm btn-secondary ms-2"  onClick={() => openUserEditCanvas(user)}>Edit</button></td>
              </tr>
            )) : (
              <tr>
                {/* <td colSpan="4" className="text-center">No users found</td> */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
        <EditOffCanvas
          show={showEdit}
          title="Edit Task"
          data={editingTask}
          setData={setEditingTask}
          onClose={() => setShowEdit(false)}
          onSubmit={handleUpdateTask}
          fields={[
            { label: 'Title', name: 'title', type: 'text' },
            { label: 'Description', name: 'description', type: 'textarea' },
            { label: 'Due Date', name: 'due_date', type: 'date' },
          ]}
          dropdowns={[
            {
              label: 'Assign To',
              name: 'user_id',
              placeholder: 'Select User',
              options: users,
              display: (u) => `${u.name} (${u.email})`,
            },
          ]}
        />



        <EditOffCanvas
          show={showUserEdit}
          title="Edit User"
          data={editingUser}
          setData={setEditingUser}
          onClose={() => setShowUserEdit(false)}
          onSubmit={handleUpdateUser}
          fields={[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
          ]}
          dropdowns={[
            {
              label: 'Role',
              name: 'role',
              placeholder: 'Select Role',
              options: [
                { id: 'admin', name: 'Admin' },
                { id: 'user', name: 'User' },
              ],
              display: (r) => r.name,
            },
          ]}
      />
    </div>
);
}
export default AdminDashboard;
