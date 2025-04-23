import React from 'react';

const RecurrenceSection = ({ 
  formData, 
  handleChange, 
  getRecurrenceOptions, 
  formatRecurrenceDescription,
  renderRecurrenceOptions,
  errors
}) => {
  return (
    <div className="form-group">
      <label htmlFor="recurrencePattern">Recurrence Pattern</label>
      <div className="recurrence-container">
        <select
          id="recurrencePattern"
          name="recurrencePattern"
          value={formData.recurrencePattern}
          onChange={handleChange}
          className="recurrence-select"
        >
          {getRecurrenceOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="recurrence-summary" aria-live="polite">
          {formatRecurrenceDescription()}
        </div>
        
        {renderRecurrenceOptions()}
      </div>
      
      {/* Notes Field */}
      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any additional instructions or notes"
          className="notes-textarea"
        ></textarea>
      </div>
    </div>
  );
};

export default RecurrenceSection;