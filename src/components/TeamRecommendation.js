import React, { useState, useEffect } from 'react';
import { rankTeamsForSituation } from './TeamScorer';

const TeamRecommendation = ({ teams, situationType, onTeamSelect }) => {
  const [rankedTeams, setRankedTeams] = useState([]);
  
  useEffect(() => {
    if (teams && situationType) {
      const sorted = rankTeamsForSituation(teams, situationType);
      setRankedTeams(sorted);
    }
  }, [teams, situationType]);
  
  if (!situationType) {
    return null;
  }
  
  return (
    <div className="team-recommendation">
      <div className="recommendation-header">
        <h4 className="recommendation-title">Recommended Teams</h4>
      </div>
      
      <div className="recommended-teams">
        {rankedTeams.length > 0 ? (
          rankedTeams.map((team, index) => {
            const scorePercentage = team.score.total / 100;
            const scoreClass = 
              scorePercentage >= 0.7 ? '' : 
              scorePercentage >= 0.4 ? 'medium' : 'low';
              
            return (
              <div key={team.id} className="recommended-team">
                <div>
                  <strong>{team.name}</strong> {' '}
                  <span className={`status ${team.status}`}>
                    {team.status.charAt(0).toUpperCase() + team.status.slice(1).replace('-', ' ')}
                  </span>
                  <div className="team-qualifications">
                    {team.members.map(member => (
                      <span key={member.id} className="team-requirement met">
                        {member.qualification}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="team-score">
                  <span className="score-value">{team.score.total}</span>
                  <div className="score-bar">
                    <div 
                      className={`score-fill ${scoreClass}`}
                      style={{ width: `${team.score.total}%` }}
                    ></div>
                  </div>
                  <button 
                    className="team-select-button" 
                    onClick={() => onTeamSelect(team.id)}
                    disabled={team.status !== 'available'}
                  >
                    Select
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No suitable teams found for this situation.</p>
        )}
      </div>
    </div>
  );
};

export default TeamRecommendation;