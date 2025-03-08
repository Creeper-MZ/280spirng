import React, { useState } from 'react';

const ResponseTracking = ({ responses, teams, onResponseUpdate, onBack }) => {
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [responseData, setResponseData] = useState({});

    const handleSelectResponse = (response) => {
        setSelectedResponse(response);
        setResponseData(response);
        setEditMode(false);
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        let updatedData = {
            ...responseData,
            status: newStatus
        };
        
        // Add timestamp based on status change
        const now = new Date().toISOString();
        
        if (newStatus === 'on-scene' && !responseData.arrivalTime) {
            updatedData.arrivalTime = now;
        } else if (newStatus === 'completed' && !responseData.completionTime) {
            updatedData.completionTime = now;
        }
        
        setResponseData(updatedData);
    };

    const handleSaveResponse = () => {
        onResponseUpdate(responseData);
        setEditMode(false);
        // Update the selected response view as well
        setSelectedResponse(responseData);
    };

    const handleInputChange = (e) => {
        const value = e.target.type === 'select-one' && e.target.name === 'priority' 
            ? parseInt(e.target.value) 
            : e.target.value;
            
        setResponseData({
            ...responseData,
            [e.target.name]: value
        });
    };

    const handlePatientChange = (field, value) => {
        setResponseData({
            ...responseData,
            patient: {
                ...(responseData.patient || {}),
                [field]: value
            }
        });
    };

    const getTeamNameById = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        return team ? team.name : 'Unknown Team';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch (e) {
            return dateString;
        }
    };

    const createNewResponse = () => {
        // Get first available team
        const availableTeam = teams.find(t => t.status === 'available');
        
        const newResponse = {
            id: `resp-${Date.now()}`,
            teamId: availableTeam ? availableTeam.id : teams[0]?.id || '',
            priority: 2,
            status: 'dispatched',
            location: '',
            dispatchTime: new Date().toISOString(),
            patient: {
                name: '',
                condition: ''
            }
        };
        
        setSelectedResponse(newResponse);
        setResponseData(newResponse);
        setEditMode(true);
    };

    return (
        <div className="form-container response-tracking">
            <h2>Response Tracking</h2>
            
            <div className="response-tracking-content">
                <div className="response-list">
                    <h3>Active Responses</h3>
                    <div className="response-buttons">
                        {responses
                            .filter(resp => resp.status !== 'completed')
                            .map(response => (
                                <button 
                                    key={response.id}
                                    className={`response-button ${selectedResponse && selectedResponse.id === response.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectResponse(response)}
                                >
                                    <div className="response-summary">
                                        <span className={`priority priority-${response.priority}`}>P{response.priority}</span>
                                        <span>{getTeamNameById(response.teamId)}</span>
                                        <span className={`status-indicator ${response.status}`}></span>
                                    </div>
                                    <div className="response-location">{response.location || 'No location'}</div>
                                </button>
                        ))}
                        <button className="response-button new-response" onClick={createNewResponse}>
                            + Create New Response
                        </button>
                    </div>
                    
                    <h3>Completed Responses</h3>
                    <div className="response-buttons">
                        {responses
                            .filter(resp => resp.status === 'completed')
                            .map(response => (
                                <button 
                                    key={response.id}
                                    className={`response-button ${selectedResponse && selectedResponse.id === response.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectResponse(response)}
                                >
                                    <div className="response-summary">
                                        <span className={`priority priority-${response.priority}`}>P{response.priority}</span>
                                        <span>{getTeamNameById(response.teamId)}</span>
                                        <span className="status-indicator completed"></span>
                                    </div>
                                    <div className="response-location">{response.location || 'No location'}</div>
                                </button>
                        ))}
                    </div>
                </div>
                
                {selectedResponse && (
                    <div className="response-details">
                        <h3>Response Details</h3>
                        
                        {editMode ? (
                            // Edit form
                            <div className="response-edit-form">
                                <div className="form-group">
                                    <label>Location:</label>
                                    <input 
                                        type="text" 
                                        name="location" 
                                        value={responseData.location || ''} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Priority:</label>
                                    <select 
                                        name="priority" 
                                        value={responseData.priority} 
                                        onChange={handleInputChange}
                                    >
                                        <option value="1">Priority 1 (Non-urgent)</option>
                                        <option value="2">Priority 2 (Urgent)</option>
                                        <option value="3">Priority 3 (Emergency)</option>
                                        <option value="4">Priority 4 (Life-threatening)</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Status:</label>
                                    <select 
                                        name="status"
                                        value={responseData.status} 
                                        onChange={handleStatusChange}
                                    >
                                        <option value="dispatched">Dispatched</option>
                                        <option value="on-scene">On Scene</option>
                                        <option value="transporting">Transporting</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Team:</label>
                                    <select 
                                        name="teamId" 
                                        value={responseData.teamId} 
                                        onChange={handleInputChange}
                                    >
                                        {teams.map(team => (
                                            <option key={team.id} value={team.id}>
                                                {team.name} (Grade {team.grade})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <h4>Patient Information</h4>
                                <div className="form-group">
                                    <label>Patient Name:</label>
                                    <input 
                                        type="text" 
                                        value={responseData.patient?.name || ''} 
                                        onChange={(e) => handlePatientChange('name', e.target.value)} 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Condition:</label>
                                    <textarea 
                                        value={responseData.patient?.condition || ''} 
                                        onChange={(e) => handlePatientChange('condition', e.target.value)} 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Notes:</label>
                                    <textarea 
                                        name="notes" 
                                        value={responseData.notes || ''} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                
                                <div className="button-group">
                                    <button className="gradient-button" onClick={handleSaveResponse}>Save Changes</button>
                                    <button className="gradient-button" onClick={() => setEditMode(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            // View mode
                            <div className="response-info">
                                <div className="info-group">
                                    <label>Response ID:</label>
                                    <p>{selectedResponse.id}</p>
                                </div>
                                
                                <div className="info-group">
                                    <label>Location:</label>
                                    <p>{selectedResponse.location || 'No location specified'}</p>
                                </div>
                                
                                <div className="info-group">
                                    <label>Priority:</label>
                                    <p className={`priority priority-${selectedResponse.priority}`}>
                                        {selectedResponse.priority} - {
                                            selectedResponse.priority === 1 ? 'Non-urgent' :
                                            selectedResponse.priority === 2 ? 'Urgent' :
                                            selectedResponse.priority === 3 ? 'Emergency' : 'Life-threatening'
                                        }
                                    </p>
                                </div>
                                
                                <div className="info-group">
                                    <label>Status:</label>
                                    <p className={`status ${selectedResponse.status}`}>
                                        {selectedResponse.status.charAt(0).toUpperCase() + selectedResponse.status.slice(1).replace('-', ' ')}
                                    </p>
                                </div>
                                
                                <div className="info-group">
                                    <label>Team:</label>
                                    <p>{getTeamNameById(selectedResponse.teamId)}</p>
                                </div>
                                
                                <div className="info-group timeline">
                                    <label>Timeline:</label>
                                    <div className="timeline-items">
                                        <div className="timeline-item">
                                            <span className="timeline-marker"></span>
                                            <div className="timeline-content">
                                                <span className="timeline-title">Dispatched</span>
                                                <span className="timeline-time">{formatDate(selectedResponse.dispatchTime)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className={`timeline-item ${!selectedResponse.arrivalTime && 'inactive'}`}>
                                            <span className="timeline-marker"></span>
                                            <div className="timeline-content">
                                                <span className="timeline-title">Arrived on Scene</span>
                                                <span className="timeline-time">{formatDate(selectedResponse.arrivalTime)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className={`timeline-item ${!selectedResponse.completionTime && 'inactive'}`}>
                                            <span className="timeline-marker"></span>
                                            <div className="timeline-content">
                                                <span className="timeline-title">Completed</span>
                                                <span className="timeline-time">{formatDate(selectedResponse.completionTime)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedResponse.patient && (
                                    <>
                                        <h4>Patient Information</h4>
                                        <div className="info-group">
                                            <label>Name:</label>
                                            <p>{selectedResponse.patient.name || 'Not provided'}</p>
                                        </div>
                                        
                                        <div className="info-group">
                                            <label>Condition:</label>
                                            <p>{selectedResponse.patient.condition || 'Not provided'}</p>
                                        </div>
                                    </>
                                )}
                                
                                {selectedResponse.notes && (
                                    <div className="info-group">
                                        <label>Notes:</label>
                                        <p>{selectedResponse.notes}</p>
                                    </div>
                                )}
                                
                                <div className="button-group">
                                    <button className="gradient-button" onClick={() => setEditMode(true)}>Update Status</button>
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

export default ResponseTracking;