import React from 'react';

const EmployeeDashboard = ({ onBack }) => {
    return (
        <div className="form-container employee-dashboard">
            <h2>Employee Dashboard</h2>
            <div className="dashboard-options">
                <div className="dashboard-section">
                    <h3>Team Management</h3>
                    <button className="dashboard-button">Manage Response Teams</button>
                    <button className="dashboard-button">Track Team Availability</button>
                    <button className="dashboard-button">View Team Qualifications</button>
                </div>
                
                <div className="dashboard-section">
                    <h3>Response Tracking</h3>
                    <button className="dashboard-button">Track Active Responses</button>
                    <button className="dashboard-button">View Call History</button>
                    <button className="dashboard-button">Create Incident Report</button>
                </div>
            </div>
            
            <div className="dashboard-section" style={{ marginTop: '20px' }}>
                <h3>EMT Management</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="dashboard-button" style={{ flex: '1' }}>View EMT Work Hours</button>
                    <button className="dashboard-button" style={{ flex: '1' }}>Track Response Times</button>
                    <button className="dashboard-button" style={{ flex: '1' }}>Manage EMT Records</button>
                </div>
            </div>
            
            <div className="button-group">
                <button type="button" className="gradient-button" onClick={onBack}>Back to Main</button>
            </div>
        </div>
    );
};

export default EmployeeDashboard;