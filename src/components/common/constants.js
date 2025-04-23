export const DURATION_TYPES = {
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months',
  YEARS: 'years',
  LIFELONG: 'lifelong'
};

export const RECURRENCE_PATTERNS = {
  DAILY: 'daily',
  ALTERNATE: 'alternate',
  CUSTOM: 'custom',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  SPECIFIC_DAYS: 'specificDays',
  SPECIFIC_DATES: 'specificDates'
};

export const FOOD_RELATIONS = {
  BEFORE: 'before',
  AFTER: 'after',
  NO_RELATION: 'noRelation'
};

export const DAYS_OF_WEEK = [
  { value: 'sun', label: 'Sun' },
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' }
];

export const generateId = () => `time_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const toggleArrayItem = (array, item) => {
  return array.includes(item) 
    ? array.filter(i => i !== item) 
    : [...array, item];
};