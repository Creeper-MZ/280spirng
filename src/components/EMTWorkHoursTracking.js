import React, { useState, useEffect } from 'react';

/**
 * Component for tracking and managing EMT work hours
 * Implements Requirement 7: The System should be able to track ETM timed worked
 */
const EMTWorkHoursTracking = ({ onBack, teams = [] }) => {
  const [emtWorkHours, setEmtWorkHours] = useState([]);
  const [selectedEMT, setSelectedEMT] = useState(null);
  const [emtList, setEmtList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clockInTime, setClockInTime] = useState('');
  const [clockOutTime, setClockOutTime] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [workLogData, setWorkLogData] = useState({
    emtId: '',
    date: '',
    clockIn: '',
    clockOut: '',
    hours: 0,
    notes: ''
  });

  // Get all EMTs from teams
  useEffect(() => {
    const emtMembers = [];
    teams.forEach(team => {
      if (team.members && team.members.length > 0) {
        team.members.forEach(member => {
          // Add team information to each EMT record
          emtMembers.push({
            ...member,
            teamName: team.name,
            teamId: team.id,
            baseStation: team.baseStation
          });
        });
      }
    });
    
    setEmtList(emtMembers);
    
    // Fetch work hours data from API
    fetchWorkHours();
  }, [teams]);

  // Fetch EMT work hours from API
  const fetchWorkHours = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/work-hours');
      
      if (response.ok) {
        const data = await response.json();
        setEmtWorkHours(data.workHours || []);
      } else {
        // If API fails, use mock data for demonstration
        const mockWorkHours = generateMockWorkHours();
        setEmtWorkHours(mockWorkHours);
      }
    } catch (error) {
      console.error('Error fetching work hours:', error);
      // Use mock data if API fails
      const mockWorkHours = generateMockWorkHours();
      setEmtWorkHours(mockWorkHours);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock work hours data for demonstration
  const generateMockWorkHours = () => {
    const mockData = [];
    // Get today's date
    const today = new Date();
    
    // Generate work hours for the past 7 days for each EMT
    emtList.forEach(emt => {
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const clockIn = new Date(date);
        clockIn.setHours(8, 0, 0); // 8:00 AM
        
        const clockOut = new Date(date);
        clockOut.setHours(16, 0, 0); // 4:00 PM
        
        const hoursWorked = 8;
        
        mockData.push({
          id: `wh-${emt.id}-${date.getTime()}`,
          emtId: emt.id,
          emtName: emt.name,
          teamId: emt.teamId,
          teamName: emt.teamName,
          date: date.toISOString().split('T')[0],
          clockIn: clockIn.toISOString(),
          clockOut: clockOut.toISOString(),
          hours: hoursWorked,
          notes: ''
        });
      }
    });
    
    return mockData;
  };

  // Handle EMT selection
  const handleSelectEMT = (emtId) => {
    const emt = emtList.find(e => e.id === emtId);
    setSelectedEMT(emt);
    
    // Set current date and time for clock in/out
    const now = new Date();
    const formattedTime = now.toTimeString().split(' ')[0].substr(0, 5);
    const formattedDate = now.toISOString().split('T')[0];
    
    setClockInTime(formattedTime);
    setClockOutTime(formattedTime);
    
    // Find today's work log if exists
    const todayLog = emtWorkHours.find(wh => 
      wh.emtId === emtId && 
      wh.date === formattedDate
    );
    
    if (todayLog) {
      const clockInTime = new Date(todayLog.clockIn).toTimeString().split(' ')[0].substr(0, 5);
      const clockOutTime = todayLog.clockOut ? 
        new Date(todayLog.clockOut).toTimeString().split(' ')[0].substr(0, 5) :
        '';
      
      setWorkLogData({
        ...todayLog,
        clockIn: clockInTime,
        clockOut: clockOutTime
      });
    } else {
      setWorkLogData({
        id: `wh-${emtId}-${Date.now()}`,
        emtId: emtId,
        emtName: emt.name,
        teamId: emt.teamId,
        teamName: emt.teamName,
        date: formattedDate,
        clockIn: formattedTime,
        clockOut: '',
        hours: 0,
        notes: ''
      });
    }
    
    setEditMode(false);
  };

  // Handle clock in/out
  const handleClockInOut = (action) => {
    if (!selectedEMT) return;
    
    const now = new Date();
    const formattedTime = now.toTimeString().split(' ')[0].substr(0, 5);
    const formattedDate = now.toISOString().split('T')[0];
    
    if (action === 'in') {
      // Check if already clocked in today
      const todayLog = emtWorkHours.find(wh => 
        wh.emtId === selectedEMT.id && 
        wh.date === formattedDate
      );
      
      if (todayLog && todayLog.clockIn) {
        alert('EMT is already clocked in for today!');
        return;
      }
      
      setClockInTime(formattedTime);
      
      const newWorkLog = {
        id: `wh-${selectedEMT.id}-${Date.now()}`,
        emtId: selectedEMT.id,
        emtName: selectedEMT.name,
        teamId: selectedEMT.teamId,
        teamName: selectedEMT.teamName,
        date: formattedDate,
        clockIn: now.toISOString(),
        clockOut: '',
        hours: 0,
        notes: 'Clocked in'
      };
      
      // Update state and save to API
      setEmtWorkHours([...emtWorkHours, newWorkLog]);
      saveWorkHours(newWorkLog);
      
    } else if (action === 'out') {
      // Find today's log to update clock out time
      const todayLog = emtWorkHours.find(wh => 
        wh.emtId === selectedEMT.id && 
        wh.date === formattedDate && 
        wh.clockIn && 
        !wh.clockOut
      );
      
      if (!todayLog) {
        alert('EMT has not clocked in today or has already clocked out!');
        return;
      }
      
      // Calculate hours worked
      const clockInDate = new Date(todayLog.clockIn);
      const hoursWorked = ((now - clockInDate) / (1000 * 60 * 60)).toFixed(2);
      
      setClockOutTime(formattedTime);
      
      const updatedLog = {
        ...todayLog,
        clockOut: now.toISOString(),
        hours: parseFloat(hoursWorked),
        notes: `Clocked out after ${hoursWorked} hours`
      };
      
      // Update state and save to API
      const updatedWorkHours = emtWorkHours.map(wh => 
        wh.id === updatedLog.id ? updatedLog : wh
      );
      
      setEmtWorkHours(updatedWorkHours);
      saveWorkHours(updatedLog);
    }
  };

  // Save work hours to API
  const saveWorkHours = async (workHoursData) => {
    try {
      const response = await fetch('/api/work-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workHoursData),
      });
      
      if (!response.ok) {
        console.warn('Failed to save work hours to API, but local state is updated');
      }
    } catch (error) {
      console.error('Error saving work hours:', error);
    }
  };

  // Handle edit form changes
  const handleInputChange = (e) => {
    setWorkLogData({
      ...workLogData,
      [e.target.name]: e.target.value
    });
  };

  // Save edited work log
  const handleSaveWorkLog = () => {
    // Calculate hours based on clock in/out times
    const formattedDate = workLogData.date;
    
    const clockInDateTime = new Date(`${formattedDate}T${workLogData.clockIn}`);
    const clockOutDateTime = new Date(`${formattedDate}T${workLogData.clockOut}`);
    
    let hoursWorked = 0;
    if (workLogData.clockOut) {
      hoursWorked = ((clockOutDateTime - clockInDateTime) / (1000 * 60 * 60)).toFixed(2);
    }
    
    const updatedLog = {
      ...workLogData,
      clockIn: clockInDateTime.toISOString(),
      clockOut: workLogData.clockOut ? clockOutDateTime.toISOString() : '',
      hours: parseFloat(hoursWorked)
    };
    
    // Check if this is a new entry or update
    const existingIndex = emtWorkHours.findIndex(wh => wh.id === updatedLog.id);
    
    let updatedWorkHours;
    if (existingIndex >= 0) {
      updatedWorkHours = emtWorkHours.map(wh => 
        wh.id === updatedLog.id ? updatedLog : wh
      );
    } else {
      updatedWorkHours = [...emtWorkHours, updatedLog];
    }
    
    setEmtWorkHours(updatedWorkHours);
    saveWorkHours(updatedLog);
    
    setEditMode(false);
  };

  // Calculate weekly and monthly hours
  const calculateHoursSummary = (emtId) => {
    const emtHours = emtWorkHours.filter(wh => wh.emtId === emtId);
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get start of week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    // Get start of month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Calculate hours
    let weeklyHours = 0;
    let monthlyHours = 0;
    
    emtHours.forEach(wh => {
      const workDate = new Date(wh.date);
      workDate.setHours(0, 0, 0, 0);
      
      if (workDate >= startOfWeek && workDate <= today) {
        weeklyHours += wh.hours || 0;
      }
      
      if (workDate >= startOfMonth && workDate <= today) {
        monthlyHours += wh.hours || 0;
      }
    });
    
    return {
      weeklyHours: weeklyHours.toFixed(1),
      monthlyHours: monthlyHours.toFixed(1)
    };
  };

  // Get EMT work logs for display
  const getEmtWorkLogs = (emtId) => {
    return emtWorkHours
      .filter(wh => wh.emtId === emtId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="form-container">
        <h2>EMT Work Hours Tracking</h2>
        <div className="loading-container">
          <p>Loading work hours data...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container team-management">
      <h2>EMT Work Hours Tracking</h2>
      
      <div className="team-management-content">
        <div className="team-list">
          <h3>EMT Staff</h3>
          <div className="filter-container">
            <span className="filter-label">Team Members</span>
          </div>
          
          <div className="team-buttons">
            {emtList.map(emt => {
              const hoursSummary = calculateHoursSummary(emt.id);
              
              return (
                <button 
                  key={emt.id}
                  className={`team-button ${selectedEMT && selectedEMT.id === emt.id ? 'selected' : ''}`}
                  onClick={() => handleSelectEMT(emt.id)}
                >
                  <div>{emt.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>
                    {emt.teamName} • {emt.role}
                  </div>
                  <div style={{ fontSize: '11px', marginTop: '3px' }}>
                    Week: {hoursSummary.weeklyHours}h | Month: {hoursSummary.monthlyHours}h
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {selectedEMT && (
          <div className="team-details">
            <h3>EMT Work Details</h3>
            
            {!editMode ? (
              <div className="team-info">
                <div className="info-group">
                  <label>Name:</label>
                  <p>{selectedEMT.name}</p>
                </div>
                
                <div className="info-group">
                  <label>Role:</label>
                  <p>{selectedEMT.role}</p>
                </div>
                
                <div className="info-group">
                  <label>Team:</label>
                  <p>{selectedEMT.teamName}</p>
                </div>
                
                <div className="info-group">
                  <label>Base Station:</label>
                  <p>{selectedEMT.baseStation || 'Not assigned'}</p>
                </div>
                
                <div className="info-group">
                  <label>Qualification:</label>
                  <p className="qualification">{selectedEMT.qualification}</p>
                </div>
                
                <div className="info-group" style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <label style={{ fontSize: '18px' }}>Current Status:</label>
                    
                    <div className="button-group" style={{ margin: '0' }}>
                      <button 
                        className="gradient-button update" 
                        style={{ padding: '6px 15px', marginTop: '-5px' }}
                        onClick={() => setEditMode(true)}
                      >
                        Edit Hours
                      </button>
                    </div>
                  </div>
                  
                  <div className="button-group" style={{ marginTop: '10px' }}>
                    <button 
                      className="gradient-button view" 
                      onClick={() => handleClockInOut('in')}
                    >
                      Clock In
                    </button>
                    <button 
                      className="gradient-button" 
                      onClick={() => handleClockInOut('out')}
                    >
                      Clock Out
                    </button>
                  </div>
                </div>
                
                <h4 style={{ marginTop: '30px' }}>Work Log History</h4>
                
                <div className="timeline">
                  <div className="timeline-items">
                    {getEmtWorkLogs(selectedEMT.id).map((workLog) => (
                      <div key={workLog.id} className="timeline-item">
                        <span className="timeline-marker"></span>
                        <div className="timeline-content">
                          <div className="timeline-title">{formatDate(workLog.date)}</div>
                          <div className="timeline-time">
                            Clock In: {formatTime(workLog.clockIn)}
                            {workLog.clockOut && ` • Clock Out: ${formatTime(workLog.clockOut)}`}
                          </div>
                          <div style={{ marginTop: '5px' }}>
                            Hours: <strong>{workLog.hours || 'Active'}</strong>
                          </div>
                          {workLog.notes && (
                            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
                              {workLog.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {getEmtWorkLogs(selectedEMT.id).length === 0 && (
                      <p>No work history available for this EMT.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="team-edit-form">
                <h4>Edit Work Log</h4>
                
                <div className="form-group">
                  <label>EMT:</label>
                  <input 
                    type="text" 
                    value={selectedEMT.name} 
                    disabled 
                  />
                </div>
                
                <div className="form-group">
                  <label>Date:</label>
                  <input 
                    type="date" 
                    name="date"
                    value={workLogData.date} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Clock In Time:</label>
                  <input 
                    type="time" 
                    name="clockIn"
                    value={workLogData.clockIn} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Clock Out Time:</label>
                  <input 
                    type="time" 
                    name="clockOut"
                    value={workLogData.clockOut} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Notes:</label>
                  <textarea 
                    name="notes"
                    value={workLogData.notes} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="button-group">
                  <button className="gradient-button" onClick={handleSaveWorkLog}>Save Work Log</button>
                  <button className="gradient-button" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="button-group">
        <button type="button" className="gradient-button" onClick={onBack}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default EMTWorkHoursTracking;