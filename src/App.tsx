// src/App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from './components/Calendar';
import { useTheme } from './ThemeContext';
import './styles.css';

interface Holiday {
  date: string;
  name: string;
}

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [location, setLocation] = useState<string>('');
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  // Fetch holidays data based on the location
  useEffect(() => {
    if (location) {
      axios.get(`https://date.nager.at/api/v2/publicholidays/2024/${location}`).then((response) => {
        setHolidays(response.data);
      });
    }
  }, [location]);

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleHolidayClick = (date: string) => {
    console.log(`Holiday clicked: ${date}`);
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>Toggle Theme</button>
      </div>
      <h1>Holiday Calendar</h1>
      <label htmlFor="location">Select Location:</label>
      <select id="location" value={location} onChange={(e) => handleLocationChange(e.target.value)}>
        <option value="us">United States</option>
        <option value="gb">United Kingdom</option>
      </select>
      <Calendar holidays={holidays} onHolidayClick={handleHolidayClick} />
    </div>
  );
};

export default App;
