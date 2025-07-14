// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeToken, getToken } from '../services/Auth';
import { toast } from 'react-toastify';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', email: '' });
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [status, setStatus] = useState('');
    const [remarks, setRemarks] = useState('')
    const [loadingTasks, setLoadingTasks] = useState(true);

    // timer
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Axios config with token
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` }
    };

    useEffect(() => {
        fetchUser();
        fetchTasks();
    }, []);

    useEffect(() => {
        let timer;
        if (startTime && activeTaskId) {
            timer = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [startTime, activeTaskId]);


    const fetchUser = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/fetch-user', config);
            setUser({ name: res.data.name, email: res.data.email });
        } catch (err) {
            console.error('Fetch user failed', err);
        }
    };

    const fetchTasks = async () => {
        try {
            setLoadingTasks(true);
            const res = await axios.get('http://localhost:8000/api/user/tasks', config);
            setTasks(res.data);
        } catch (err) {
            console.error('Fetch tasks failed', err);
        } finally {
            setLoadingTasks(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:8000/api/update-profile`, user, config);
            toast.success(res.data.message || 'Profile updated successfully');

        } catch (err) {
            console.error('Update failed', err);
            toast.error(err.response?.data?.message || 'Profile update failed');
        }
    };


    const handleUpdateProgress = async () => {
        if (!selectedTask || !status) return;
        const timeSpent = status === "completed" ? elapsedTime : null;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `http://localhost:8000/api/task/${selectedTask.id}`,
                {
                    status,
                    remarks,
                    time_spent: timeSpent
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert('Task updated successfully');
            if (status === "in_progress") {
                setActiveTaskId(selectedTask.id);
                setStartTime(Date.now());
                setElapsedTime(0);
            }

            if (status === "completed") {
                setActiveTaskId(null);
                setStartTime(null);
            }
            fetchTasks();
        } catch (err) {
            console.error('Failed to update task', err);
            toast.error(err.response?.data?.message || 'Failed to update task');
        }
    };

    return (
        <div>

            <nav className="navbar navbar-expand-lg navbar-dark mb-5" style={{ backgroundColor: '#0f214d' }}>
                <div className="container-fluid">
                    <span className="navbar-brand">User Dashboard</span>
                        {activeTaskId && (
                        <div className="text-white me-3">
                            <strong>Timer: </strong>
                            {Math.floor(elapsedTime / 3600).toString().padStart(2, '0')}:
                            {Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0')}:
                            {(elapsedTime % 60).toString().padStart(2, '0')}
                        </div>
                        )}
                    <div className="ms-auto">
                        <button className="btn btn-outline-light" id="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>


            <div className="container mt-4">
                <div className="card p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <h4>Update Profile</h4>
                    <form onSubmit={handleProfileUpdate} className="mb-4">
                        <div className="row align-items-end">
                            <div className="col-sm-12 col-md-5 mb-3">
                                <label>Name</label>
                                <input type="text" className="form-control" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                            </div>
                            <div className="col-sm-12 col-md-5 mb-3">
                                <label>Email</label>
                                <input type="email" className="form-control" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} disabled />
                            </div>

                            <div className="col-sm-12 col-md-5 mb-3">
                                <label>Password</label>
                                <input type="password" className="form-control" />
                            </div>

                            <div className="col-sm-12 col-md-3 mb-3 d-flex align-items-end">
                                <button className="btn btn-success text-white w-100" style={{ backgroundColor: '#0f214d' }} >
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
                                <th>Description</th>
                                <th>Status</th>
                                <th>Start Date</th>
                                <th>Due Date</th>
                                <th>Remarks</th>
                                <th>Action</th>
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
                            ) :
                            tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <tr key={task.id}>
                                        <td>{index + 1}</td>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
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
                                        )}</td>
                                        <td>{new Date(task.start_date).toLocaleDateString()}</td>
                                        <td>{new Date(task.due_date).toLocaleDateString()}</td>
                                        <td>{task.remarks || '-'}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#updateCanvas"
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setStatus(task.status || '');
                                                    setRemarks(task.remarks || '');
                                                }}
                                            >
                                                Update Status
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" style={{ textAlign: 'center' }}>No tasks assigned</td></tr>
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
                            <h5 style={{ textTransform: 'uppercase', color: '#c32727ff' }}>Task: {selectedTask.title}</h5>
                            <div className="mb-3 mt-3">
                                <label>Status</label>
                                <select
                                    type="text"
                                    className="form-control"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>

                                </select>
                                <label>Remarks</label>
                                <textarea
                                    type="text"
                                    value={remarks}
                                    className="form-control"
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn text-white"
                                style={{ backgroundColor: '#0f214d' }}
                                onClick={handleUpdateProgress}
                                data-bs-dismiss="offcanvas"
                            >
                                Update
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
