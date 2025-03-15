import React, { useState, useEffect } from 'react';

const AvailabilityDashboard = ({ teams, responses }) => {
  const [availabilityStats, setAvailabilityStats] = useState({
    available: 0,
    onCall: 0,
    onScene: 0,
    unavailable: 0,
    total: 0,
  });
  
  const [responseStats, setResponseStats] = useState({
    active: 0,
    completed: 0,
    total: 0,
  });

  useEffect(() => {
    // Calculate team availability stats
    const stats = {
      available: 0,
      onCall: 0,
      onScene: 0,
      unavailable: 0,
      total: teams.length,
    };
    
    teams.forEach(team => {
      if (team.status === 'available') stats.available++;
      else if (team.status === 'on-call') stats.onCall++;
      else if (team.status === 'on-scene') stats.onScene++;
      else stats.unavailable++;
    });
    
    setAvailabilityStats(stats);
    
    // Calculate response stats
    const respStats = {
      active: 0,
      completed: 0,
      total: responses.length,
    };
    
    responses.forEach(response => {
      if (response.status === 'completed') respStats.completed++;
      else respStats.active++;
    });
    
    setResponseStats(respStats);
  }, [teams, responses]);

  return (
    <div className="availability-dashboard">
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h4>Team Availability</h4>
          <div className="stat-container">
            <div className="stat-item">
              <span className="stat-value">{availabilityStats.available}</span>
              <span className="stat-label">Available</span>
              <span className="status-indicator available"></span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{availabilityStats.onCall + availabilityStats.onScene}</span>
              <span className="stat-label">Responding</span>
              <span className="status-indicator on-call"></span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{availabilityStats.unavailable}</span>
              <span className="stat-label">Unavailable</span>
              <span className="status-indicator unavailable"></span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{availabilityStats.total}</span>
              <span className="stat-label">Total Teams</span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h4>Response Status</h4>
          <div className="stat-container">
            <div className="stat-item">
              <span className="stat-value">{responseStats.active}</span>
              <span className="stat-label">Active Calls</span>
              <span className="status-indicator on-call"></span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{responseStats.completed}</span>
              <span className="stat-label">Completed</span>
              <span className="status-indicator completed"></span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{responseStats.total}</span>
              <span className="stat-label">Total Responses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityDashboard;