import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-container">
            <h2>Welcome to Dashboard</h2>
            <p>Hello, {user?.username || 'User'}!</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard; 