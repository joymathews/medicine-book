import React, { useState, useEffect } from 'react';
import { auth } from '../../configurations/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../../styles/addmedicine.css';
import { addMedicine } from '../../services/apiService';
import Header from './Header';
import MedicineForm from './MedicineForm';
import { DURATION_TYPES, RECURRENCE_PATTERNS, FOOD_RELATIONS, generateId } from '../common/constants';

function AddMedicine() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medicineName: '',
    doctor: '',
    purpose: '',
    prescriptionDate: '',
    durationValue: '',
    durationType: DURATION_TYPES.DAYS,
    recurrencePattern: RECURRENCE_PATTERNS.DAILY,
    recurrenceInterval: '1',
    specificDays: [],
    specificDates: [],
    notes: '',
    morningDose: false,
    morningFoodRelation: FOOD_RELATIONS.AFTER,
    noonDose: false,
    noonFoodRelation: FOOD_RELATIONS.AFTER,
    nightDose: false,
    nightFoodRelation: FOOD_RELATIONS.AFTER,
    customTimes: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [customTimeError, setCustomTimeError] = useState('');
  const [newCustomTime, setNewCustomTime] = useState({
    time: '',
    foodRelation: FOOD_RELATIONS.AFTER
  });

  // Get available recurrence patterns based on duration type
  const getRecurrenceOptions = () => {
    switch(formData.durationType) {
      case DURATION_TYPES.DAYS:
        return [
          { value: RECURRENCE_PATTERNS.DAILY, label: 'Daily' },
          { value: RECURRENCE_PATTERNS.ALTERNATE, label: 'Alternate days' },
          { value: RECURRENCE_PATTERNS.CUSTOM, label: 'Every X days' }
        ];
      case DURATION_TYPES.WEEKS:
        return [
          { value: RECURRENCE_PATTERNS.DAILY, label: 'Daily' },
          { value: RECURRENCE_PATTERNS.ALTERNATE, label: 'Alternate days' },
          { value: RECURRENCE_PATTERNS.CUSTOM, label: 'Every X days' },
          { value: RECURRENCE_PATTERNS.SPECIFIC_DAYS, label: 'Specific days of week' }
        ];
      case DURATION_TYPES.MONTHS:
      case DURATION_TYPES.YEARS:
        return [
          { value: RECURRENCE_PATTERNS.DAILY, label: 'Daily' },
          { value: RECURRENCE_PATTERNS.ALTERNATE, label: 'Alternate days' },
          { value: RECURRENCE_PATTERNS.CUSTOM, label: 'Every X days' },
          { value: RECURRENCE_PATTERNS.WEEKLY, label: 'Weekly' },
          { value: RECURRENCE_PATTERNS.BIWEEKLY, label: 'Bi-weekly' },
          { value: RECURRENCE_PATTERNS.SPECIFIC_DAYS, label: 'Specific days of week' },
          { value: RECURRENCE_PATTERNS.SPECIFIC_DATES, label: 'Specific dates of month' }
        ];
      case DURATION_TYPES.LIFELONG:
        return [
          { value: RECURRENCE_PATTERNS.DAILY, label: 'Daily' },
          { value: RECURRENCE_PATTERNS.ALTERNATE, label: 'Alternate days' },
          { value: RECURRENCE_PATTERNS.CUSTOM, label: 'Every X days' },
          { value: RECURRENCE_PATTERNS.WEEKLY, label: 'Weekly' },
          { value: RECURRENCE_PATTERNS.BIWEEKLY, label: 'Bi-weekly' },
          { value: RECURRENCE_PATTERNS.MONTHLY, label: 'Monthly' },
          { value: RECURRENCE_PATTERNS.SPECIFIC_DAYS, label: 'Specific days of week' },
          { value: RECURRENCE_PATTERNS.SPECIFIC_DATES, label: 'Specific dates of month' }
        ];
      default:
        return [{ value: RECURRENCE_PATTERNS.DAILY, label: 'Daily' }];
    }
  };

  // Reset recurrence when duration type changes
  useEffect(() => {
    // Handle null or undefined duration type
    const durationType = formData.durationType || DURATION_TYPES.DAYS;
    
    // Get valid options for this duration type
    const validOptions = getRecurrenceOptions().map(option => option.value);
    
    // Check if current pattern is valid
    const isCurrentPatternValid = validOptions.includes(formData.recurrencePattern);
    
    if (!isCurrentPatternValid) {
      // Reset to a safe default for this duration type
      const defaultPattern = validOptions[0] || RECURRENCE_PATTERNS.DAILY;
      
      setFormData(prevData => ({
        ...prevData,
        recurrencePattern: defaultPattern,
        recurrenceInterval: defaultPattern === RECURRENCE_PATTERNS.CUSTOM ? prevData.recurrenceInterval : '1',
        specificDays: [],
        specificDates: []
      }));
    }
  }, [formData.durationType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const actualValue = type === 'checkbox' ? checked : value;
    
    // Clear any existing error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData(prevData => ({
      ...prevData,
      [name]: actualValue
    }));
    
    // Handle special field dependencies
    if (name === 'durationType' && value === DURATION_TYPES.LIFELONG) {
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
    
    // Clear custom time error when user starts typing again
    if (customTimeError) {
      setCustomTimeError('');
    }
  };

  const addCustomTime = () => {
    if (!newCustomTime.time.trim()) return;
    
    // Check for duplicate times
    const isDuplicate = formData.customTimes.some(
      existingTime => existingTime.time === newCustomTime.time
    );
    
    if (isDuplicate) {
      setCustomTimeError('This time is already added');
      return;
    }
    
    setFormData(prevData => ({
      ...prevData,
      customTimes: [
        ...prevData.customTimes,
        { ...newCustomTime, id: generateId() }
      ]
    }));
    
    // Reset the input fields
    setNewCustomTime({
      time: '',
      foodRelation: FOOD_RELATIONS.AFTER
    });
  };

  const removeCustomTime = (id) => {
    setFormData(prevData => ({
      ...prevData,
      customTimes: prevData.customTimes.filter(time => time.id !== id)
    }));
  };

  const handleDaySelection = (day) => {
    setFormData(prevData => ({
      ...prevData,
      specificDays: prevData.specificDays.includes(day)
        ? prevData.specificDays.filter(d => d !== day)
        : [...prevData.specificDays, day]
    }));
  };

  const handleDateSelection = (date) => {
    setFormData(prevData => ({
      ...prevData,
      specificDates: prevData.specificDates.includes(date)
        ? prevData.specificDates.filter(d => d !== date)
        : [...prevData.specificDates, date]
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate medicine name
    if (!formData.medicineName.trim()) {
      errors.medicineName = 'Medicine name is required';
    }
    
    // Validate duration value if not lifelong
    if (formData.durationType !== DURATION_TYPES.LIFELONG) {
      if (!formData.durationValue || parseInt(formData.durationValue) < 1) {
        errors.durationValue = 'Please enter a valid duration';
      }
    }
    
    // Validate recurrence interval for custom pattern
    if (formData.recurrencePattern === RECURRENCE_PATTERNS.CUSTOM) {
      if (!formData.recurrenceInterval || parseInt(formData.recurrenceInterval) < 1) {
        errors.recurrenceInterval = 'Please enter a valid interval';
      }
    }
    
    // Check if at least one dosing time is selected
    const hasTimingSelected = formData.morningDose || formData.noonDose || 
      formData.nightDose || formData.customTimes.length > 0;
    
    if (!hasTimingSelected) {
      errors.timing = 'Please select at least one time to take the medicine';
    }
    
    // For specific days pattern, ensure at least one day is selected
    if (formData.recurrencePattern === RECURRENCE_PATTERNS.SPECIFIC_DAYS && 
        formData.specificDays.length === 0) {
      errors.specificDays = 'Please select at least one day of the week';
    }
    
    // For specific dates pattern, ensure at least one date is selected
    if (formData.recurrencePattern === RECURRENCE_PATTERNS.SPECIFIC_DATES && 
        formData.specificDates.length === 0) {
      errors.specificDates = 'Please select at least one date of the month';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Prepare data for API
      const medicineData = {
        medicineName: formData.medicineName,
        doctor: formData.doctor,
        purpose: formData.purpose,
        prescriptionDate: formData.prescriptionDate,
        duration: {
          value: formData.durationType !== DURATION_TYPES.LIFELONG ? formData.durationValue : null,
          type: formData.durationType.toUpperCase()
        },
        recurrence: {
          pattern: formData.recurrencePattern.toUpperCase(),
          interval: formData.recurrencePattern === RECURRENCE_PATTERNS.CUSTOM ? formData.recurrenceInterval : null,
          specificDays: formData.recurrencePattern === RECURRENCE_PATTERNS.SPECIFIC_DAYS ? formData.specificDays : null,
          specificDates: formData.recurrencePattern === RECURRENCE_PATTERNS.SPECIFIC_DATES ? formData.specificDates : null
        },
        dosage: {
          morning: {
            enabled: formData.morningDose,
            foodRelation: formData.morningDose ? formData.morningFoodRelation.toUpperCase() : null
          },
          noon: {
            enabled: formData.noonDose,
            foodRelation: formData.noonDose ? formData.noonFoodRelation.toUpperCase() : null
          },
          night: {
            enabled: formData.nightDose,
            foodRelation: formData.nightDose ? formData.nightFoodRelation.toUpperCase() : null
          },
          customTimes: formData.customTimes.map(time => ({
            id: time.id,
            time: time.time,
            foodRelation: time.foodRelation.toUpperCase()
          }))
        },
        notes: formData.notes
      };
    
      // Save medicine data using API
      const result = await addMedicine(medicineData);
      setSubmitMessage(result.message || 'Medicine details saved successfully!');
      
      // Reset form and errors after successful submission
      setFormData({
        medicineName: '',
        doctor: '',
        purpose: '',
        prescriptionDate: '',
        durationValue: '',
        durationType: DURATION_TYPES.DAYS,
        recurrencePattern: RECURRENCE_PATTERNS.DAILY,
        recurrenceInterval: '1',
        specificDays: [],
        specificDates: [],
        notes: '',
        morningDose: false,
        morningFoodRelation: FOOD_RELATIONS.AFTER,
        noonDose: false,
        noonFoodRelation: FOOD_RELATIONS.AFTER,
        nightDose: false,
        nightFoodRelation: FOOD_RELATIONS.AFTER,
        customTimes: []
      });
      setFormErrors({});
      setCustomTimeError('');
    } catch (error) {
      console.error('Error saving medicine details:', error);
      setSubmitMessage(error.message || 'Failed to save medicine details. Please try again.');
    }
    finally {
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

  return (
    <div className="home-container">
      <Header onLogout={handleLogout} />
      
      <MedicineForm
        formData={formData}
        newCustomTime={newCustomTime}
        handleChange={handleChange}
        handleCustomTimeChange={handleCustomTimeChange}
        addCustomTime={addCustomTime}
        removeCustomTime={removeCustomTime}
        handleDaySelection={handleDaySelection}
        handleDateSelection={handleDateSelection}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitMessage={submitMessage}
        formErrors={formErrors}
        customTimeError={customTimeError}
        getRecurrenceOptions={getRecurrenceOptions}
      />
    </div>
  );
}

export default AddMedicine;