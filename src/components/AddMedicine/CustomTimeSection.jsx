import React from 'react';
import { FOOD_RELATIONS } from '../common/constants';

const CustomTimeSection = ({
  customTimes,
  newCustomTime,
  handleCustomTimeChange,
  addCustomTime,
  removeCustomTime,
  customTimeError,
}) => {
  return (
    <div className="custom-time-section">
      <h3>Custom Times</h3>
      
      {/* List of added custom times */}
      {customTimes.length > 0 && (
        <div className="custom-times-list">
          {customTimes.map(customTime => (
            <div key={customTime.id} className="custom-time-entry">
              <div className="custom-time-header">
                <span>{customTime.time}</span>
                <button 
                  type="button" 
                  className="remove-time-btn"
                  onClick={() => removeCustomTime(customTime.id)}
                  aria-label={`Remove time ${customTime.time}`}
                >
                  ×
                </button>
              </div>
              <div className="custom-time-relation">
                <span>
                  {customTime.foodRelation === FOOD_RELATIONS.BEFORE && 'Take before food'}
                  {customTime.foodRelation === FOOD_RELATIONS.AFTER && 'Take after food'}
                  {customTime.foodRelation === FOOD_RELATIONS.NO_RELATION && 'No relation to food'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add new custom time */}
      <div className="add-custom-time">
        <div className="custom-time-inputs">
          <input
            type="time"
            name="time"
            value={newCustomTime.time}
            onChange={handleCustomTimeChange}
            className="custom-time-input"
            step="60" // Limit to hours and minutes, no seconds
            aria-invalid={!!customTimeError}
            aria-describedby={customTimeError ? "custom-time-error" : undefined}
          />
          
          <select
            name="foodRelation"
            value={newCustomTime.foodRelation}
            onChange={handleCustomTimeChange}
            className="food-relation-select"
          >
            <option value={FOOD_RELATIONS.BEFORE}>Before Food</option>
            <option value={FOOD_RELATIONS.AFTER}>After Food</option>
            <option value={FOOD_RELATIONS.NO_RELATION}>No Relation to Food</option>
          </select>
        </div>
        
        {customTimeError && (
          <div id="custom-time-error" className="error-message field-error">
            {customTimeError}
          </div>
        )}
        
        <button 
          type="button" 
          className="add-time-btn"
          onClick={addCustomTime}
          disabled={!newCustomTime.time.trim()}
        >
          + Add Time
        </button>
      </div>
    </div>
  );
};

export default CustomTimeSection;