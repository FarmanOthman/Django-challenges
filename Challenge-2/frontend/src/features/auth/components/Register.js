import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password2) {
            setError("Passwords don't match");
            return;
        }

        try {
            await api.post('auth/register/', formData);
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.data) {
                // Handle specific validation errors
                const errors = err.response.data;
                if (errors.username) setError(`Username: ${errors.username[0]}`);
                else if (errors.email) setError(`Email: ${errors.email[0]}`);
                else if (errors.password) setError(`Password: ${errors.password[0]}`);
                else setError('Registration failed - Please check your details');
            } else {
                setError('Registration failed - Please try again');
            }
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
                        Password must be at least 8 characters long
                    </small>
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register; 