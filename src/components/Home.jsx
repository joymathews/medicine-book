import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
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