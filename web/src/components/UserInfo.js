import React, { useState } from 'react';

const UserInfo = ({ onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        medicalHistory: '',
        address: ''
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
            <h2>Additional Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
          <textarea
              name="medicalHistory"
              placeholder="Medical History"
              value={formData.medicalHistory}
              onChange={handleChange}
              required
              rows="4"
          />
                </div>
                <div className="form-group">
          <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="2"
          />
                </div>
                <div className="button-group">
                    <button type="submit" className="gradient-button employee">Submit</button>
                    <button type="button" className="gradient-button" onClick={onBack}>Back</button>
                </div>
            </form>
        </div>
    );
};

export default UserInfo;