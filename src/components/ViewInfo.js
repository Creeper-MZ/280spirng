import React from 'react';

const ViewInfo = ({ userData, onBack }) => {
    return (
        <div className="form-container">
            <h2>Your Information</h2>
            <div className="info-display">
                <div className="info-group">
                    <label>Name:</label>
                    <p>{userData.firstName} {userData.lastName}</p>
                </div>
                <div className="info-group">
                    <label>Email:</label>
                    <p>{userData.email}</p>
                </div>
                <div className="info-group">
                    <label>Phone:</label>
                    <p>{userData.phone}</p>
                </div>
                <div className="info-group">
                    <label>Address:</label>
                    <p>{userData.address || 'Not provided'}</p>
                </div>
                <div className="info-group">
                    <label>Medical History:</label>
                    <p>{userData.medicalHistory || 'Not provided'}</p>
                </div>
            </div>
            <div className="button-group">
                <button type="button" className="gradient-button" onClick={onBack}>Back</button>
            </div>
        </div>
    );
};

export default ViewInfo;