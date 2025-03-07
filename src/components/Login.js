import React, { useState } from 'react';

const Login = ({ onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        isEmployee: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    return (
        <div className="form-container">
            <div className="logo-container">
                <h2 className="eris-logo">ERIS</h2>
            </div>
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
                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="isEmployee"
                            checked={formData.isEmployee}
                            onChange={handleChange}
                        />
                        <span>I am an employee (EMT, Operator, Supervisor)</span>
                    </label>
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