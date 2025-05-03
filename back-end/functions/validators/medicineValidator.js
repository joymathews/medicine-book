const { ValidationError } = require('../errors/customErrors');

/**
 * Validates medicine data according to the API contract
 * @param {Object} data - Medicine data to validate
 * @throws {ValidationError} If validation fails
 */
function validateMedicineData(data) {
  const errors = {};

  // Required field validation
  if (!data.medicineName || data.medicineName.trim() === '') {
    errors.medicineName = 'Medicine name is required';
  }

  // Duration validation
  if (data.duration) {
    if (data.duration.type !== 'LIFELONG' && (!data.duration.value || data.duration.value <= 0)) {
      errors.duration = 'Please enter a valid duration';
    }
  }

  // Recurrence validation
  if (data.recurrence) {
    if (data.recurrence.pattern === 'CUSTOM' && (!data.recurrence.interval || data.recurrence.interval <= 0)) {
      errors.recurrence = 'Please enter a valid interval';
    }

    if (data.recurrence.pattern === 'SPECIFIC_DAYS' && 
        (!data.recurrence.specificDays || data.recurrence.specificDays.length === 0)) {
      errors.specificDays = 'Please select at least one day of the week';
    }

    if (data.recurrence.pattern === 'SPECIFIC_DATES' && 
        (!data.recurrence.specificDates || data.recurrence.specificDates.length === 0)) {
      errors.specificDates = 'Please select at least one date of the month';
    }
  }

  // Dosage validation - at least one time must be enabled
  if (data.dosage) {
    const hasMorning = data.dosage.morning && data.dosage.morning.enabled;
    const hasNoon = data.dosage.noon && data.dosage.noon.enabled;
    const hasNight = data.dosage.night && data.dosage.night.enabled;
    const hasCustomTimes = data.dosage.customTimes && data.dosage.customTimes.length > 0;
    
    if (!hasMorning && !hasNoon && !hasNight && !hasCustomTimes) {
      errors.dosage = 'Please select at least one time to take the medicine';
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }
}

module.exports = { validateMedicineData };