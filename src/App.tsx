import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from './components/Calendar';
import CountrySelector from './components/CountrySelector';

interface CountryOption {
  value: string;
  label: string;
}

const App: React.FC = () => {
  const [location, setLocation] = useState<string>('IN');
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [showCountrySelector, setShowCountrySelector] = useState<boolean>(false);

  useEffect(() => {
    const fetchCountryOptions = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data.map((country: any) => ({
          value: country.cca2,
          label: country.name.common,
        }));
        setCountryOptions(countries);
      } catch (error) {
        console.error('Error fetching country options:', error);
      }
    };

    fetchCountryOptions();
  }, []);

  const handleLocationChange = (selectedOption: string | CountryOption | null) => {
    if (selectedOption) {
      setLocation(typeof selectedOption === 'string' ? selectedOption : selectedOption.value);
    } else {
      setLocation('');
    }
    setShowCountrySelector(false);
  };

  const handleHolidayClick = (date: string) => {
    console.log(`Holiday clicked: ${date}`);
  };

  return (
    <div className="app-container mt-5 md:mt-0">
      <CountrySelector
        isOpen={showCountrySelector}
        options={countryOptions}
        selectedValue={location}
        onClose={() => setShowCountrySelector(false)}
        onSelect={handleLocationChange}
      />

      <Calendar  onHolidayClick={handleHolidayClick} location={location} setLocation={setLocation} />
    </div>
  );
};

export default App;
