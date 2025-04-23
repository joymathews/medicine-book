import React from 'react';

const BasicInfoSection = ({ formData, handleChange, errors }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="medicineName">Medicine Name</label>
        <input
          type="text"
          id="medicineName"
          name="medicineName"
          value={formData.medicineName}
          onChange={handleChange}
          required
          placeholder="Enter medicine name"
          aria-invalid={!!errors.medicineName}
          aria-describedby={errors.medicineName ? "medicineName-error" : undefined}
        />
        {errors.medicineName && (
          <div id="medicineName-error" className="error-message field-error">
            {errors.medicineName}
          </div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="doctor">Prescribing Doctor</label>
        <input
          type="text"
          id="doctor"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          placeholder="Enter doctor's name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="purpose">Purpose</label>
        <textarea
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="What is this medicine for?"
        ></textarea>
      </div>
    </>
  );
};

export default BasicInfoSection;