import React, { useState } from 'react';
import { useScore } from '/context/ScoreContext'; // Import the Score Context
import styles from './ScoreTracker.module.css'; // Import CSS module

const ScoreTracker = () => {
  const { score, setScore } = useScore(); // Get score and setScore from context
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;

    // Validate the input value
    if (value === '' || value < 0) {
      setError('Score must be at least 0');
    } else {
      setError('');
    }

    setScore(value); // Update the score in context
  };

  // Calculate the percentage for the progress bar, ensuring it’s a number
  const progressPercentage = score !== '' ? (Number(score) / 2000) * 100 : 0;

  return (
    <div className={styles.container}>
      <input
        type="number"
        value={score}
        onChange={handleChange}
        min="0"
        max="200"
        className={`${styles.input} ${error ? styles.errorInput : ''}`} // Add error class if there's an error
        style={{ width: '60px', textAlign: 'center' }} // Inline styles for better presentation
      />
      {/* Show error message */}
      {error && <p className={styles.errorMessage}>{error}</p>}
      
      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${progressPercentage}%` }} // Dynamically set width based on score
        />
      </div>
    </div>
  );
};

export default ScoreTracker;
