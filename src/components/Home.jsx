import React, { useState, useEffect } from 'react';
import { auth } from '../configurations/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medicineName: '',
    doctor: '',
    purpose: '',
    prescriptionDate: '',
    durationValue: '',
    durationType: 'days', // days, weeks, months, years, lifelong
    recurrencePattern: 'daily', // daily, alternate, custom, weekly, biweekly, monthly
    recurrenceInterval: '1', // Used for "every X days" pattern
    specificDays: [], // For weekly patterns - which days of week
    specificDates: [], // For monthly patterns - which dates of month
    notes: '',
    morningDose: false,
    morningFoodRelation: 'after',
    noonDose: false,
    noonFoodRelation: 'after',
    nightDose: false,
    nightFoodRelation: 'after',
    customTimes: [] // Array to hold custom time entries
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [newCustomTime, setNewCustomTime] = useState({
    time: '',
    foodRelation: 'after'
  });

  // Get available recurrence patterns based on duration type
  const getRecurrenceOptions = () => {
    switch(formData.durationType) {
      case 'days':
        return [
          { value: 'daily', label: 'Daily' },
          { value: 'alternate', label: 'Alternate days' },
          { value: 'custom', label: 'Every X days' }
        ];
      case 'weeks':
        return [
          { value: 'daily', label: 'Daily' },
          { value: 'alternate', label: 'Alternate days' },
          { value: 'custom', label: 'Every X days' },
          { value: 'specificDays', label: 'Specific days of week' }
        ];
      case 'months':
      case 'years':
        return [
          { value: 'daily', label: 'Daily' },
          { value: 'alternate', label: 'Alternate days' },
          { value: 'custom', label: 'Every X days' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'biweekly', label: 'Bi-weekly' },
          { value: 'specificDays', label: 'Specific days of week' },
          { value: 'specificDates', label: 'Specific dates of month' }
        ];
      case 'lifelong':
        return [
          { value: 'daily', label: 'Daily' },
          { value: 'alternate', label: 'Alternate days' },
          { value: 'custom', label: 'Every X days' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'biweekly', label: 'Bi-weekly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'specificDays', label: 'Specific days of week' },
          { value: 'specificDates', label: 'Specific dates of month' }
        ];
      default:
        return [{ value: 'daily', label: 'Daily' }];
    }
  };

  // Reset recurrence when duration type changes
  useEffect(() => {
    // If current recurrence pattern isn't valid for the new duration type, reset to daily
    const validOptions = getRecurrenceOptions().map(option => option.value);
    if (!validOptions.includes(formData.recurrencePattern)) {
      setFormData(prevData => ({
        ...prevData,
        recurrencePattern: 'daily',
        recurrenceInterval: '1',
        specificDays: [],
        specificDates: []
      }));
    }
  }, [formData.durationType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // When durationType is set to lifelong, clear the duration value
    if (name === 'durationType' && value === 'lifelong') {
      setFormData(prevData => ({
        ...prevData,
        durationValue: ''
      }));
    }
  };

  const handleCustomTimeChange = (e) => {
    const { name, value } = e.target;
    setNewCustomTime(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCustomTime = () => {
    if (!newCustomTime.time.trim()) return;
    
    setFormData(prevData => ({
      ...prevData,
      customTimes: [
        ...prevData.customTimes,
        { ...newCustomTime, id: Date.now() } // Add unique ID for each entry
      ]
    }));
    
    // Reset the input fields
    setNewCustomTime({
      time: '',
      foodRelation: 'after'
    });
  };

  const removeCustomTime = (id) => {
    setFormData(prevData => ({
      ...prevData,
      customTimes: prevData.customTimes.filter(time => time.id !== id)
    }));
  };

  const handleDaySelection = (day) => {
    setFormData(prevData => {
      const updatedDays = [...prevData.specificDays];
      
      if (updatedDays.includes(day)) {
        // Remove day if already selected
        return {
          ...prevData,
          specificDays: updatedDays.filter(d => d !== day)
        };
      } else {
        // Add day if not already selected
        return {
          ...prevData,
          specificDays: [...updatedDays, day]
        };
      }
    });
  };

  const handleDateSelection = (date) => {
    setFormData(prevData => {
      const updatedDates = [...prevData.specificDates];
      
      if (updatedDates.includes(date)) {
        // Remove date if already selected
        return {
          ...prevData,
          specificDates: updatedDates.filter(d => d !== date)
        };
      } else {
        // Add date if not already selected
        return {
          ...prevData,
          specificDates: [...updatedDates, date]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would normally save the data to your database
      console.log('Medicine data submitted:', formData);
      setSubmitMessage('Medicine details saved successfully!');
      
      // Reset form after successful submission
      setFormData({
        medicineName: '',
        doctor: '',
        purpose: '',
        prescriptionDate: '',
        durationValue: '',
        durationType: 'days',
        recurrencePattern: 'daily',
        recurrenceInterval: '1',
        specificDays: [],
        specificDates: [],
        notes: '',
        morningDose: false,
        morningFoodRelation: 'after',
        noonDose: false,
        noonFoodRelation: 'after',
        nightDose: false,
        nightFoodRelation: 'after',
        customTimes: []
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving medicine details:', error);
      setSubmitMessage('Failed to save medicine details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
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
              value="before"
              checked={formData[fieldName] === "before"}
              onChange={handleChange}
            />
            Before Food
          </label>
          <label>
            <input
              type="radio"
              name={fieldName}
              value="after"
              checked={formData[fieldName] === "after"}
              onChange={handleChange}
            />
            After Food
          </label>
          <label>
            <input
              type="radio"
              name={fieldName}
              value="noRelation"
              checked={formData[fieldName] === "noRelation"}
              onChange={handleChange}
            />
            No Relation
          </label>
        </div>
      </div>
    );
  };
  
  // Render recurrence options based on selected pattern
  const renderRecurrenceOptions = () => {
    switch(formData.recurrencePattern) {
      case 'custom':
        return (
          <div className="recurrence-detail">
            <label>Take every</label>
            <div className="interval-container">
              <input
                type="number"
                name="recurrenceInterval"
                value={formData.recurrenceInterval}
                onChange={handleChange}
                min="1"
                max="30"
                className="interval-input"
              />
              <span>days</span>
            </div>
          </div>
        );
      
      case 'specificDays':
        const daysOfWeek = [
          { value: 'sun', label: 'Sun' },
          { value: 'mon', label: 'Mon' },
          { value: 'tue', label: 'Tue' },
          { value: 'wed', label: 'Wed' },
          { value: 'thu', label: 'Thu' },
          { value: 'fri', label: 'Fri' },
          { value: 'sat', label: 'Sat' }
        ];
        
        return (
          <div className="recurrence-detail">
            <label>Select days of week:</label>
            <div className="days-selector">
              {daysOfWeek.map(day => (
                <button
                  key={day.value}
                  type="button"
                  className={`day-button ${formData.specificDays.includes(day.value) ? 'selected' : ''}`}
                  onClick={() => handleDaySelection(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'specificDates':
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
                >
                  {date}
                </button>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Format recurrence for display
  const formatRecurrenceDescription = () => {
    switch(formData.recurrencePattern) {
      case 'daily':
        return 'Take every day';
      case 'alternate':
        return 'Take every other day';
      case 'custom':
        return `Take every ${formData.recurrenceInterval} day(s)`;
      case 'weekly':
        return 'Take once a week';
      case 'biweekly':
        return 'Take once every two weeks';
      case 'monthly':
        return 'Take once a month';
      case 'specificDays':
        if (formData.specificDays.length === 0) return 'No days selected';
        return `Take on: ${formData.specificDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}`;
      case 'specificDates':
        if (formData.specificDates.length === 0) return 'No dates selected';
        return `Take on date(s): ${formData.specificDates.join(', ')}`;
      default:
        return '';
    }
  };

  // Check if at least one time slot is selected
  const hasSelectedTimeSlot = formData.morningDose || formData.noonDose || 
    formData.nightDose || formData.customTimes.length > 0;

  return (
    <div className="home-container">
      <div className="header">
        <h1>Medicine Book</h1>
        <button 
          onClick={handleLogout} 
          className="logout-button"
        >
          Logout
        </button>
      </div>

      <div className="form-container">
        <h2>Add New Medicine</h2>
        
        <form onSubmit={handleSubmit}>
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
            />
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
                value={formData.durationType}
                onChange={handleChange}
                className="duration-select"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
                <option value="lifelong">Lifelong</option>
              </select>
              
              <input
                type="number"
                name="durationValue"
                value={formData.durationValue}
                onChange={handleChange}
                placeholder="Duration"
                min="1"
                disabled={formData.durationType === 'lifelong'}
                className={formData.durationType === 'lifelong' ? 'disabled-input' : ''}
              />
            </div>
          </div>
          
          {/* Smart Recurrence Field */}
          <div className="form-group">
            <label>Recurrence Pattern</label>
            <div className="recurrence-container">
              <select
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
              
              <div className="recurrence-summary">
                {formatRecurrenceDescription()}
              </div>
              
              {renderRecurrenceOptions()}
            </div>
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
                  />
                  Night
                </label>
                {renderFoodRelationOptions('night')}
              </div>
              
              {/* Custom Time Section */}
              <div className="custom-time-section">
                <h3>Custom Times</h3>
                
                {/* List of added custom times */}
                {formData.customTimes.length > 0 && (
                  <div className="custom-times-list">
                    {formData.customTimes.map(customTime => (
                      <div key={customTime.id} className="custom-time-entry">
                        <div className="custom-time-header">
                          <span>{customTime.time}</span>
                          <button 
                            type="button" 
                            className="remove-time-btn"
                            onClick={() => removeCustomTime(customTime.id)}
                          >
                            ×
                          </button>
                        </div>
                        <div className="custom-time-relation">
                          <span>
                            {customTime.foodRelation === 'before' && 'Take before food'}
                            {customTime.foodRelation === 'after' && 'Take after food'}
                            {customTime.foodRelation === 'noRelation' && 'No relation to food'}
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
                    />
                    
                    <select
                      name="foodRelation"
                      value={newCustomTime.foodRelation}
                      onChange={handleCustomTimeChange}
                      className="food-relation-select"
                    >
                      <option value="before">Before Food</option>
                      <option value="after">After Food</option>
                      <option value="noRelation">No Relation to Food</option>
                    </select>
                  </div>
                  
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
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting || !hasSelectedTimeSlot || !formData.medicineName}
          >
            {isSubmitting ? 'Saving...' : 'Save Medicine'}
          </button>
          
          {submitMessage && (
            <div className={submitMessage.includes('Failed') ? 'error-message' : 'success-message'}>
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Home;