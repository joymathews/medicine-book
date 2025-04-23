import React from 'react';
import CustomTimeSection from './CustomTimeSection';
import { FOOD_RELATIONS } from '../common/constants';

const DosingScheduleSection = ({ 
  formData, 
  newCustomTime, 
  handleChange, 
  handleCustomTimeChange, 
  addCustomTime, 
  removeCustomTime, 
  renderFoodRelationOptions,
  customTimeError,
  errors
}) => {
  return (
    <div className="form-group">
      <label>When to Take</label>
      <p className="hint-text">Select all applicable times and specify food relation for each</p>
      
      <div className="dosage-timing">
        <div className="dosage-time">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="morningDose"
              checked={formData.morningDose}
              onChange={handleChange}
              aria-describedby={errors.timing ? "timing-error" : undefined}
            />
            Morning
          </label>
          {renderFoodRelationOptions('morning')}
        </div>
        
        <div className="dosage-time">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="noonDose"
              checked={formData.noonDose}
              onChange={handleChange}
              aria-describedby={errors.timing ? "timing-error" : undefined}
            />
            Noon
          </label>
          {renderFoodRelationOptions('noon')}
        </div>
        
        <div className="dosage-time">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="nightDose"
              checked={formData.nightDose}
              onChange={handleChange}
              aria-describedby={errors.timing ? "timing-error" : undefined}
            />
            Night
          </label>
          {renderFoodRelationOptions('night')}
        </div>
        
        {errors.timing && (
          <div id="timing-error" className="error-message field-error timing-error">
            {errors.timing}
          </div>
        )}
        
        <CustomTimeSection
          customTimes={formData.customTimes}
          newCustomTime={newCustomTime}
          handleCustomTimeChange={handleCustomTimeChange}
          addCustomTime={addCustomTime}
          removeCustomTime={removeCustomTime}
          customTimeError={customTimeError}
        />
      </div>
    </div>
  );
};

export default DosingScheduleSection;