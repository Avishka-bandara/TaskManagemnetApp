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
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');



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
      <nav className="navbar navbar-expand-lg navbar-dark " style={{ backgroundColor: '#0f214d' }}>
        <div className="container-fluid">
          <span className="navbar-brand">Admin Dashboard</span>
          {/* Toggler for mobile view */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible content */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="ms-auto d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
              <button
                className="btn btn-outline-light"
                id="home-btn"
                onClick={() => navigate('/admin')}
              >
                Home
              </button>
              <button
                className="btn btn-outline-light"
                id="add-user-btn"
                onClick={() => navigate('/admin/register-user')}
              >
                Add User
              </button>
              <button
                className="btn btn-outline-light"
                id="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>


      {/* Create Task Form */}
      <div className="container mt-4">
        <div className="card p-3 mb-5" style={{ backgroundColor: '#f8f9fa' }}>
          <h4>Create New Task</h4>
          <form onSubmit={handleCreateTask} className="mb-2">
            <div className="row">
              <div className="col-sm-12 col-md-6 mb-3">
                <label>Title</label>
                <input type="text" name="title" className="form-control" required value={taskForm.title} onChange={handleTaskChange} />
              </div>

              <div className="col-sm-12 col-md-6 mb-3">
                <label>Due Date</label>
                <input type="date" name="due_date" className="form-control" required value={taskForm.due_date} onChange={handleTaskChange} />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6 mb-3">
                <label>Description</label>
                <textarea name="description" className="form-control" required value={taskForm.description} onChange={handleTaskChange}></textarea>
              </div>
              <div className="col-sm-12 col-md-6 mb-3">
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
        <div className='card p-3 mb-5'>
          <div className="d-flex justify-content-end mb-3">
            <select
              className="form-select w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input type="text" className="form-control w-auto" placeholder="Search by title or user" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <table className="table table-bordered table-striped mt-3 align-middle text-center responsive ">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Time Spent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingTasks ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                (() => {
                  const filteredTasks = tasks.filter(
                    (task) => !statusFilter || task.status === statusFilter
                  )
                  .filter((task) =>
                    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                  return filteredTasks.length > 0 ? filteredTasks.map((task, index) => (
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
                      <td>{task.start_date || 'N/A'}</td>
                      <td>{task.due_date}</td>
                      <td> {task.time_spent
                        ? new Date(task.time_spent * 1000).toISOString().substr(11, 8)
                        : 'N/A'}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        <button className="btn btn-sm btn-secondary ms-2" onClick={() => openEditCanvas(task)}>Edit</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" className="text-center">No tasks found</td>
                    </tr>
                  );
                })()
              )}
            </tbody>
          </table>
        </div>


        {/* User Table */}
        <h4>All Users</h4>
        <div className='card p-3'>
           <div className="d-flex justify-content-end mb-3">
            <input type="text" className="form-control w-auto" placeholder="Search by name or email" value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
          </div>
          <table className="table table-bordered table-striped mb-5 mt-3 align-middle text-center responsive">
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
              ) :(
              users
                .filter((user) =>
                  user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                  user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                )
                .map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(user.id)}>Delete</button>
                      <button className="btn btn-sm btn-secondary ms-2" onClick={() => openUserEditCanvas(user)}>Edit</button></td>
                  </tr>
                )) 
                )}
            </tbody>
          </table>
        </div>
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
