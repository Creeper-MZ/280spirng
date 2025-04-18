import React from 'react';
import AvailabilityDashboard from './AvailabilityDashboard';

const EmployeeDashboard = ({ 
  onBack, 
  onTeamsClick, 
  onResponsesClick,
  onWorkHoursClick,
  onReportsClick,
  teams = [],
  responses = [] 
}) => {
    return (
        <div className="form-container employee-dashboard">
            <h2>Employee Dashboard</h2>
            
            {/* Add Availability Dashboard */}
            <AvailabilityDashboard teams={teams} responses={responses} />
            
            <div className="dashboard-options">
                <div className="dashboard-section">
                    <h3>Team Management</h3>
                    <button className="dashboard-button" onClick={onTeamsClick}>Manage Response Teams</button>
                    <button className="dashboard-button" onClick={onTeamsClick}>Track Team Availability</button>
                    <button className="dashboard-button" onClick={onTeamsClick}>View Team Qualifications</button>
                </div>
                
                <div className="dashboard-section">
                    <h3>Response Tracking</h3>
                    <button className="dashboard-button" onClick={onResponsesClick}>Track Active Responses</button>
                    <button className="dashboard-button" onClick={onResponsesClick}>View Call History</button>
                    <button className="dashboard-button" onClick={onReportsClick}>Create Incident Report</button>
                </div>
            </div>
            
            <div className="dashboard-section" style={{ marginTop: '20px' }}>
                <h3>EMT Management</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="dashboard-button" style={{ flex: '1' }} onClick={onWorkHoursClick}>View EMT Work Hours</button>
                    <button className="dashboard-button" style={{ flex: '1' }} onClick={onResponsesClick}>Track Response Times</button>
                    <button className="dashboard-button" style={{ flex: '1' }} onClick={onTeamsClick}>Manage EMT Records</button>
                </div>
            </div>
            
            <div className="button-group">
                <button type="button" className="gradient-button" onClick={onBack}>Back to Main</button>
            </div>
        </div>
    );
};

export default EmployeeDashboard;