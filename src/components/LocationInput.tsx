// src/components/LocationInput.tsx
import React, { useState } from 'react';

interface LocationInputProps {
  onLocationChange: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationChange }) => {
  const [location, setLocation] = useState<string>('');

  const handleLocationChange = () => {
    // Your logic for handling location change
    onLocationChange(location);
  };

  return (
    <div>
      {/* Your location input component */}
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      <button onClick={handleLocationChange}>Change Location</button>
    </div>
  );
};

export default LocationInput;
