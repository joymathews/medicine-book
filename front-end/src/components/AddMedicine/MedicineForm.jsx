import React from 'react';
import BasicInfoSection from './BasicInfoSection';
import DurationSection from './DurationSection';
import RecurrenceSection from './RecurrenceSection';
import DosingScheduleSection from './DosingScheduleSection';
import SubmitSection from './SubmitSection';
import { RECURRENCE_PATTERNS, FOOD_RELATIONS, DAYS_OF_WEEK } from '../common/constants';

const MedicineForm = ({
  formData,
  newCustomTime,
  handleChange,
  handleCustomTimeChange,
  addCustomTime,
  removeCustomTime,
  handleDaySelection,
  handleDateSelection,
  handleSubmit,
  isSubmitting,
  submitMessage,
  formErrors,
  customTimeError,
  getRecurrenceOptions
}) => {
  
  // Format recurrence for display
  const formatRecurrenceDescription = () => {
    switch(formData.recurrencePattern) {
      case RECURRENCE_PATTERNS.DAILY:
        return 'Take every day';
      case RECURRENCE_PATTERNS.ALTERNATE:
        return 'Take every other day';
      case RECURRENCE_PATTERNS.CUSTOM:
        return `Take every ${formData.recurrenceInterval} day(s)`;
      case RECURRENCE_PATTERNS.WEEKLY:
        return 'Take once a week';
      case RECURRENCE_PATTERNS.BIWEEKLY:
        return 'Take once every two weeks';
      case RECURRENCE_PATTERNS.MONTHLY:
        return 'Take once a month';
      case RECURRENCE_PATTERNS.SPECIFIC_DAYS:
        if (formData.specificDays.length === 0) return 'No days selected';
        return `Take on: ${formData.specificDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}`;
      case RECURRENCE_PATTERNS.SPECIFIC_DATES:
        if (formData.specificDates.length === 0) return 'No dates selected';
        return `Take on date(s): ${formData.specificDates.join(', ')}`;
      default:
        return '';
    }
  };

  // Render recurrence options based on selected pattern
  const renderRecurrenceOptions = () => {
    switch(formData.recurrencePattern) {
      case RECURRENCE_PATTERNS.CUSTOM:
        return (
          <div className="recurrence-detail">
            <label htmlFor="recurrenceInterval">Take every</label>
            <div className="interval-container">
              <input
                type="number"
                id="recurrenceInterval"
                name="recurrenceInterval"
                value={formData.recurrenceInterval}
                onChange={handleChange}
                min="1"
                max="30"
                className="interval-input"
                aria-invalid={!!formErrors.recurrenceInterval}
                aria-describedby={formErrors.recurrenceInterval ? "recurrenceInterval-error" : undefined}
              />
              <span>days</span>
              {formErrors.recurrenceInterval && (
                <div id="recurrenceInterval-error" className="error-message field-error">
                  {formErrors.recurrenceInterval}
                </div>
              )}
            </div>
          </div>
        );
      
      case RECURRENCE_PATTERNS.SPECIFIC_DAYS:
        return (
          <div className="recurrence-detail">
            <label>Select days of week:</label>
            <div className="days-selector">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day.value}
                  type="button"
                  className={`day-button ${formData.specificDays.includes(day.value) ? 'selected' : ''}`}
                  onClick={() => handleDaySelection(day.value)}
                  aria-pressed={formData.specificDays.includes(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>
            {formErrors.specificDays && (
              <div className="error-message field-error">
                {formErrors.specificDays}
              </div>
            )}
          </div>
        );
        
      case RECURRENCE_PATTERNS.SPECIFIC_DATES:
        const datesOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
        
        return (
          <div className="recurrence-detail">
            <label>Select dates of month:</label>
            <div className="dates-selector">
              {datesOfMonth.map(date => (
                <button
                  key={date}
                  type="button"
                  className={`date-button ${formData.specificDates.includes(date.toString()) ? 'selected' : ''}`}
                  onClick={() => handleDateSelection(date.toString())}
                  aria-pressed={formData.specificDates.includes(date.toString())}
                >
                  {date}
                </button>
              ))}
            </div>
            {formErrors.specificDates && (
              <div className="error-message field-error">
                {formErrors.specificDates}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Helper function to render food relation options for each time
  const renderFoodRelationOptions = (timeOfDay) => {
    const fieldName = `${timeOfDay}FoodRelation`;
    if (!formData[`${timeOfDay}Dose`]) return null;
    
    return (
      <div className="food-relation-options">
        <label>When to take:</label>
        <div className="radio-inline-group">
          <label>
            <input
              type="radio"
              name={fieldName}
              value={FOOD_RELATIONS.BEFORE}
              checked={formData[fieldName] === FOOD_RELATIONS.BEFORE}
              onChange={handleChange}
            />
            Before Food
          </label>
          <label>
            <input
              type="radio"
              name={fieldName}
              value={FOOD_RELATIONS.AFTER}
              checked={formData[fieldName] === FOOD_RELATIONS.AFTER}
              onChange={handleChange}
            />
            After Food
          </label>
          <label>
            <input
              type="radio"
              name={fieldName}
              value={FOOD_RELATIONS.NO_RELATION}
              checked={formData[fieldName] === FOOD_RELATIONS.NO_RELATION}
              onChange={handleChange}
            />
            No Relation
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="form-container">
      <h2>Add New Medicine</h2>
      
      <form onSubmit={handleSubmit} noValidate>
        <BasicInfoSection 
          formData={formData} 
          handleChange={handleChange}
          errors={formErrors}
        />
        
        <DurationSection 
          formData={formData} 
          handleChange={handleChange}
          errors={formErrors}
        />
        
        <RecurrenceSection 
          formData={formData}
          handleChange={handleChange}
          getRecurrenceOptions={getRecurrenceOptions}
          formatRecurrenceDescription={formatRecurrenceDescription}
          renderRecurrenceOptions={renderRecurrenceOptions}
          errors={formErrors}
        />
        
        <DosingScheduleSection 
          formData={formData}
          newCustomTime={newCustomTime}
          handleChange={handleChange}
          handleCustomTimeChange={handleCustomTimeChange}
          addCustomTime={addCustomTime}
          removeCustomTime={removeCustomTime}
          renderFoodRelationOptions={renderFoodRelationOptions}
          customTimeError={customTimeError}
          errors={formErrors}
        />
        
        <SubmitSection 
          isSubmitting={isSubmitting}
          submitMessage={submitMessage}
          hasError={Object.keys(formErrors).length > 0}
        />
      </form>
    </div>
  );
};

export default MedicineForm;