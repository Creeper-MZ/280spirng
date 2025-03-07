import React, { useState } from 'react';

const UpdateInfo = ({ userData, onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        medicalHistory: userData.medicalHistory || ''
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
            <h2>Update Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
          <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
          />
                </div>
                <div className="form-group">
          <textarea
              name="medicalHistory"
              placeholder="Medical History"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="4"
          />
                </div>
                <div className="button-group">
                    <button type="submit" className="gradient-button employee">Update</button>
                    <button type="button" className="gradient-button" onClick={onBack}>Back</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateInfo;