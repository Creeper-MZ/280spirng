import React from 'react';

const TeamFilter = ({ onFilterChange, filter }) => {
  return (
    <div className="filter-container">
      <span className="filter-label">Filter by:</span>
      <div className="filter-buttons">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All Teams
        </button>
        <button 
          className={`filter-button ${filter === 'available' ? 'active' : ''}`}
          onClick={() => onFilterChange('available')}
        >
          Available
        </button>
        <button 
          className={`filter-button ${filter === 'on-call' ? 'active' : ''}`}
          onClick={() => onFilterChange('on-call')}
        >
          On Call
        </button>
        <button 
          className={`filter-button ${filter === 'on-scene' ? 'active' : ''}`}
          onClick={() => onFilterChange('on-scene')}
        >
          On Scene
        </button>
        <button 
          className={`filter-button ${filter === 'unavailable' ? 'active' : ''}`}
          onClick={() => onFilterChange('unavailable')}
        >
          Unavailable
        </button>
      </div>
    </div>
  );
};

export default TeamFilter;