import React, { useState } from 'react';

const TeamManagement = ({ teams, onTeamUpdate, onBack }) => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [teamData, setTeamData] = useState({});

    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
        setTeamData(team);
        setEditMode(false);
    };

    const handleEditTeam = () => {
        setEditMode(true);
    };

    const handleSaveTeam = () => {
        onTeamUpdate(teamData);
        setEditMode(false);
        // Update the selected team view as well
        setSelectedTeam(teamData);
    };

    const handleInputChange = (e) => {
        const value = e.target.type === 'select-one' && e.target.name === 'grade' 
            ? parseInt(e.target.value) 
            : e.target.value;
            
        setTeamData({
            ...teamData,
            [e.target.name]: value
        });
    };

    const handleStatusChange = (e) => {
        setTeamData({
            ...teamData,
            status: e.target.value
        });
    };

    const handleMemberChange = (index, field, value) => {
        const updatedMembers = [...teamData.members];
        updatedMembers[index] = {
            ...updatedMembers[index],
            [field]: value
        };
        
        setTeamData({
            ...teamData,
            members: updatedMembers
        });
    };

    const addNewMember = () => {
        const newMember = {
            id: `emp-${Date.now()}`,
            name: "",
            role: "",
            qualification: "Basic Life Support"
        };
        
        setTeamData({
            ...teamData,
            members: [...teamData.members, newMember]
        });
    };

    const removeMember = (index) => {
        const updatedMembers = [...teamData.members];
        updatedMembers.splice(index, 1);
        
        setTeamData({
            ...teamData,
            members: updatedMembers
        });
    };

    const createNewTeam = () => {
        const newTeam = {
            id: `team-${Date.now()}`,
            name: "New Team",
            grade: 1,
            status: "available",
            members: [],
            baseStation: ""
        };
        
        setSelectedTeam(newTeam);
        setTeamData(newTeam);
        setEditMode(true);
    };

    return (
        <div className="form-container team-management">
            <h2>Team Management</h2>
            
            <div className="team-management-content">
                <div className="team-list">
                    <h3>Response Teams</h3>
                    <div className="team-buttons">
                        {teams.map(team => (
                            <button 
                                key={team.id}
                                className={`team-button ${selectedTeam && selectedTeam.id === team.id ? 'selected' : ''}`}
                                onClick={() => handleSelectTeam(team)}
                            >
                                {team.name} (Grade {team.grade})
                                <span className={`status-indicator ${team.status}`}></span>
                            </button>
                        ))}
                        <button className="team-button new-team" onClick={createNewTeam}>
                            + Create New Team
                        </button>
                    </div>
                </div>
                
                {selectedTeam && (
                    <div className="team-details">
                        <h3>Team Details</h3>
                        
                        {editMode ? (
                            // Edit form
                            <div className="team-edit-form">
                                <div className="form-group">
                                    <label>Team Name:</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={teamData.name} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Grade:</label>
                                    <select 
                                        name="grade" 
                                        value={teamData.grade} 
                                        onChange={handleInputChange}
                                    >
                                        <option value="1">Grade 1 (Basic Life Support)</option>
                                        <option value="2">Grade 2 (Advanced Life Support)</option>
                                        <option value="3">Grade 3 (Critical Care)</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Status:</label>
                                    <select 
                                        value={teamData.status} 
                                        onChange={handleStatusChange}
                                    >
                                        <option value="available">Available</option>
                                        <option value="on-call">On Call</option>
                                        <option value="on-scene">On Scene</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Base Station:</label>
                                    <input 
                                        type="text" 
                                        name="baseStation" 
                                        value={teamData.baseStation} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                
                                <h4>Team Members</h4>
                                {teamData.members.map((member, index) => (
                                    <div key={index} className="member-edit">
                                        <div className="form-group">
                                            <label>Name:</label>
                                            <input 
                                                type="text" 
                                                value={member.name} 
                                                onChange={(e) => handleMemberChange(index, 'name', e.target.value)} 
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Role:</label>
                                            <input 
                                                type="text" 
                                                value={member.role} 
                                                onChange={(e) => handleMemberChange(index, 'role', e.target.value)} 
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Qualification:</label>
                                            <select 
                                                value={member.qualification} 
                                                onChange={(e) => handleMemberChange(index, 'qualification', e.target.value)}
                                            >
                                                <option value="Basic Life Support">Basic Life Support</option>
                                                <option value="Advanced Life Support">Advanced Life Support</option>
                                                <option value="Critical Care">Critical Care</option>
                                            </select>
                                        </div>
                                        
                                        <button 
                                            type="button" 
                                            className="remove-button"
                                            onClick={() => removeMember(index)}
                                        >
                                            Remove Member
                                        </button>
                                    </div>
                                ))}
                                
                                <button 
                                    type="button" 
                                    className="add-button"
                                    onClick={addNewMember}
                                >
                                    + Add Team Member
                                </button>
                                
                                <div className="button-group">
                                    <button className="gradient-button" onClick={handleSaveTeam}>Save Changes</button>
                                    <button className="gradient-button" onClick={() => setEditMode(false)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            // View mode
                            <div className="team-info">
                                <div className="info-group">
                                    <label>Team Name:</label>
                                    <p>{selectedTeam.name}</p>
                                </div>
                                
                                <div className="info-group">
                                    <label>Grade:</label>
                                    <p>{selectedTeam.grade} - {
                                        selectedTeam.grade === 1 ? 'Basic Life Support' :
                                        selectedTeam.grade === 2 ? 'Advanced Life Support' : 'Critical Care'
                                    }</p>
                                </div>
                                
                                <div className="info-group">
                                    <label>Status:</label>
                                    <p className={`status ${selectedTeam.status}`}>
                                        {selectedTeam.status.charAt(0).toUpperCase() + selectedTeam.status.slice(1).replace('-', ' ')}
                                    </p>
                                </div>
                                
                                <div className="info-group">
                                    <label>Base Station:</label>
                                    <p>{selectedTeam.baseStation || 'Not assigned'}</p>
                                </div>
                                
                                <h4>Team Members</h4>
                                <div className="team-members">
                                    {selectedTeam.members.length > 0 ? (
                                        selectedTeam.members.map((member, index) => (
                                            <div key={index} className="member-card">
                                                <h5>{member.name}</h5>
                                                <p>{member.role}</p>
                                                <p className="qualification">{member.qualification}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No team members assigned yet.</p>
                                    )}
                                </div>
                                
                                <div className="button-group">
                                    <button className="gradient-button" onClick={handleEditTeam}>Edit Team</button>
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

export default TeamManagement;