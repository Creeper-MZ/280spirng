import React, { useState } from 'react';

const Login = ({ onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="identifier"
                        placeholder="Email or Phone"
                        value={formData.identifier}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="button-group">
                    <button type="submit" className="gradient-button login">Login</button>
                    <button type="button" className="gradient-button" onClick={onBack}>Back</button>
                </div>
            </form>
        </div>
    );
};

export default Login;