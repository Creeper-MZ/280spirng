/**
 * Utility to score teams based on their suitability for different emergency situations
 */

// Define situationType to required qualification/grade mapping
const SITUATION_REQUIREMENTS = {
    'minor': { 
      minGrade: 1, 
      preferredQualifications: ['Basic Life Support'] 
    },
    'moderate': { 
      minGrade: 2, 
      preferredQualifications: ['Advanced Life Support'] 
    },
    'severe': { 
      minGrade: 3, 
      preferredQualifications: ['Critical Care'] 
    },
    'trauma': { 
      minGrade: 2, 
      preferredQualifications: ['Trauma Care', 'Advanced Life Support'] 
    },
    'cardiac': { 
      minGrade: 3, 
      preferredQualifications: ['Critical Care', 'Advanced Cardiac Life Support'] 
    },
    'pediatric': { 
      minGrade: 2, 
      preferredQualifications: ['Pediatric Care', 'Advanced Life Support'] 
    }
  };
  
  /**
   * Calculate a score for how suitable a team is for a given situation type
   * @param {Object} team - The team object
   * @param {string} situationType - The type of emergency situation
   * @return {Object} Score and explanation
   */
  export const scoreTeamForSituation = (team, situationType) => {
    if (!team || !situationType || !SITUATION_REQUIREMENTS[situationType]) {
      return { score: 0, explanation: 'Unknown situation type or team' };
    }
    
    const requirements = SITUATION_REQUIREMENTS[situationType];
    const score = {
      total: 0,
      gradeScore: 0,
      qualificationScore: 0,
      availabilityScore: 0,
      meetsMinimum: false,
      explanation: []
    };
    
    // Score based on team grade
    if (team.grade >= requirements.minGrade) {
      score.gradeScore = 50;
      score.explanation.push(`Team grade (${team.grade}) meets or exceeds required grade (${requirements.minGrade})`);
      score.meetsMinimum = true;
    } else {
      score.gradeScore = 0;
      score.explanation.push(`Team grade (${team.grade}) is below required grade (${requirements.minGrade})`);
    }
    
    // Score based on team member qualifications
    let qualificationMatches = 0;
    const teamQualifications = team.members.map(member => member.qualification);
    
    requirements.preferredQualifications.forEach(qual => {
      if (teamQualifications.includes(qual)) {
        qualificationMatches++;
        score.explanation.push(`Team has member(s) with ${qual} qualification`);
      }
    });
    
    score.qualificationScore = Math.min(40, (qualificationMatches / requirements.preferredQualifications.length) * 40);
    
    // Score based on availability
    if (team.status === 'available') {
      score.availabilityScore = 10;
      score.explanation.push('Team is currently available');
    } else {
      score.availabilityScore = 0;
      score.explanation.push(`Team is currently ${team.status}`);
    }
    
    // Calculate total score
    score.total = score.gradeScore + score.qualificationScore + score.availabilityScore;
    
    return score;
  };
  
  /**
   * Sort teams by their suitability for a given situation
   * @param {Array} teams - Array of team objects
   * @param {string} situationType - The type of emergency situation
   * @return {Array} Sorted teams with scores
   */
  export const rankTeamsForSituation = (teams, situationType) => {
    if (!teams || !situationType) return [];
    
    const scoredTeams = teams.map(team => {
      const score = scoreTeamForSituation(team, situationType);
      return {
        ...team,
        score
      };
    });
    
    return scoredTeams.sort((a, b) => b.score.total - a.score.total);
  };
  
  const TeamScorer = {
    scoreTeamForSituation,
    rankTeamsForSituation,
    SITUATION_REQUIREMENTS
  };
  
  export default TeamScorer;