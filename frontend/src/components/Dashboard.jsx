// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeToken, getToken } from '../services/Auth';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', email: '' });
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [progress, setProgress] = useState('');

    // Axios config with token
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` }
    };

    useEffect(() => {
        fetchUser();
        fetchTasks();
    }, []);


    const fetchUser = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/fetch-auth', config);
            setUser({ name: res.data.name, email: res.data.email });
        } catch (err) {
            console.error('Fetch user failed', err);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/tasks', config);
            setTasks(res.data);
        } catch (err) {
            console.error('Fetch tasks failed', err);
        }
    };

    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/update-profile', user, config);
            alert('Profile updated successfully');
        } catch (err) {
            console.error('Update failed', err);
            alert('Profile update failed');
        }
    };


    const handleUpdateProgress = async () => {
        if (!selectedTask) return;
        try {
            await axios.post(`http://localhost:8000/api/task/${selectedTask.id}`, { progress }, config);
            alert('Task progress updated!');
            fetchTasks();
        } catch (err) {
            console.error('Progress update failed', err);
        }
    };

    return (
        <div className="dashboard">

            <nav className="navbar navbar-expand-lg navbar-dark mb-5" style={{ backgroundColor: '#0f214d' }}>
                <div className="container-fluid">
                    <span className="navbar-brand">User Dashboard</span>
                    <div className="ms-auto">
                        <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>


            <div className="container mt-4">
                <div className="card p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <h4>Update Profile</h4>
                    <form onSubmit={handleProfileUpdate} className="mb-4">
                        <div className="row align-items-end">
                            <div className="col-md-5 mb-3">
                                <label>Name</label>
                                <input type="text" className="form-control" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                            </div>
                            <div className="col-md-5 mb-3">
                                <label>Email</label>
                                <input type="email" className="form-control" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                            </div>

                            <div className="col-md-5 mb-3">
                                <label>Password</label>
                                <input type="password" className="form-control"  />
                            </div>

                            <div className="col-md-3 mb-3 d-flex align-items-end">
                                <button className="btn btn-success text-white w-100" >
                                    Update
                                </button>

                            </div>
                        </div>
                    </form>
                </div>

                {/* Task Table */}
                <div className="mt-5">
                    <h4>My Tasks</h4>
                    <table className=" table table-bordered table-striped">
                        <thead className="table-primary">
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Progress</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <tr key={task.id}>
                                        <td>{index + 1}</td>
                                        <td>{task.title}</td>
                                        <td>{task.status}</td>
                                        <td>{task.progress || 'Not Started'}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#updateCanvas"
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setProgress(task.progress || '');
                                                }}
                                            >
                                                Update Progress
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No tasks assigned</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bootstrap Offcanvas */}
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="updateCanvas">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Update Task Progress</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {selectedTask ? (
                        <>
                            <h6>Task: {selectedTask.title}</h6>
                            <div className="mb-3 mt-3">
                                <label>Progress</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={progress}
                                    onChange={(e) => setProgress(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn text-white"
                                style={{ backgroundColor: '#0f214d' }}
                                onClick={handleUpdateProgress}
                                data-bs-dismiss="offcanvas"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <p>No task selected</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
