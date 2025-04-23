import React from 'react';

const SubmitSection = ({ isSubmitting, submitMessage, hasError }) => {
  return (
    <>
      <button 
        type="submit" 
        className="submit-button"
        disabled={isSubmitting || hasError}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Medicine'}
      </button>
      
      {submitMessage && (
        <div 
          className={submitMessage.includes('Failed') ? 'error-message' : 'success-message'}
          role="status"
          aria-live="polite"
        >
          {submitMessage}
        </div>
      )}
    </>
  );
};

export default SubmitSection;