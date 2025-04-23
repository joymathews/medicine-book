import React from 'react';
import { DURATION_TYPES } from '../common/constants';

const DurationSection = ({ formData, handleChange, errors }) => {
  return (
    <>
      {/* Prescription Date */}
      <div className="form-group">
        <label htmlFor="prescriptionDate">Prescription Date</label>
        <input
          type="date"
          id="prescriptionDate"
          name="prescriptionDate"
          value={formData.prescriptionDate}
          onChange={handleChange}
          className="date-input"
        />
      </div>
      
      {/* Duration Field */}
      <div className="form-group">
        <label>Duration</label>
        <div className="duration-container reversed">
          <select
            name="durationType"
            id="durationType"
            value={formData.durationType}
            onChange={handleChange}
            className="duration-select"
          >
            <option value={DURATION_TYPES.DAYS}>Days</option>
            <option value={DURATION_TYPES.WEEKS}>Weeks</option>
            <option value={DURATION_TYPES.MONTHS}>Months</option>
            <option value={DURATION_TYPES.YEARS}>Years</option>
            <option value={DURATION_TYPES.LIFELONG}>Lifelong</option>
          </select>
          
          <input
            type="number"
            id="durationValue"
            name="durationValue"
            value={formData.durationValue}
            onChange={handleChange}
            placeholder="Duration"
            min="1"
            disabled={formData.durationType === DURATION_TYPES.LIFELONG}
            className={formData.durationType === DURATION_TYPES.LIFELONG ? 'disabled-input' : ''}
            aria-invalid={!!errors.durationValue}
            aria-describedby={errors.durationValue ? "durationValue-error" : undefined}
          />
        </div>
        {errors.durationValue && (
          <div id="durationValue-error" className="error-message field-error">
            {errors.durationValue}
          </div>
        )}
      </div>
    </>
  );
};

export default DurationSection;