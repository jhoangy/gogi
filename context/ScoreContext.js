import React, { createContext, useContext, useState } from 'react';

// Create the Score Context
const ScoreContext = createContext();

// Custom hook for easy access to the ScoreContext
export const useScore = () => useContext(ScoreContext);

// Provider component
export const ScoreProvider = ({ children }) => {
  const [score, setScore] = useState(0); // Default score can be set to 0 or any initial value

  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      {children}
    </ScoreContext.Provider>
  );
};
